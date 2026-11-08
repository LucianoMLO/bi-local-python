// Porta de entrada de um app estático no marketplace fabricasaas.app.
// Login com Google (OpenID Connect, fluxo de código), lista de e-mails permitidos (admin e usuário),
// sessão em cookie assinado (HMAC-SHA256). Sem banco: o app estático segue guardando o progresso no navegador.
// Segredos (wrangler secret): GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET.
// Variáveis: ADMIN_EMAILS, USER_EMAILS (separados por vírgula), APP_NAME, APP_ORIGIN, AMBIENTE.

const SESSAO_SEGUNDOS = 7 * 24 * 3600;
const PUBLICOS = new Set(["/manifest.webmanifest", "/sw.js", "/favicon.ico", "/apple-touch-icon.png", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png"]);
const enc = new TextEncoder();

const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const deb64u = (s) => Uint8Array.from(atob(s.replaceAll("-", "+").replaceAll("_", "/")), (c) => c.charCodeAt(0));
const lista = (v) => (v ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

async function chave(env) {
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) throw new Error("SESSION_SECRET ausente ou curto (mínimo 32 caracteres)");
  return crypto.subtle.importKey("raw", enc.encode(env.SESSION_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function assinar(env, obj) {
  const corpo = b64u(enc.encode(JSON.stringify(obj)));
  const sig = await crypto.subtle.sign("HMAC", await chave(env), enc.encode(corpo));
  return `${corpo}.${b64u(sig)}`;
}

export async function verificar(env, valor) {
  if (!valor || !valor.includes(".")) return null;
  const [corpo, sig] = valor.split(".");
  try {
    const ok = await crypto.subtle.verify("HMAC", await chave(env), deb64u(sig), enc.encode(corpo));
    if (!ok) return null;
    const obj = JSON.parse(new TextDecoder().decode(deb64u(corpo)));
    return obj.exp > Date.now() / 1000 ? obj : null;
  } catch {
    return null;
  }
}

function cookie(req, nome) {
  for (const parte of (req.headers.get("cookie") ?? "").split(";")) {
    const i = parte.indexOf("=");
    if (i > 0 && parte.slice(0, i).trim() === nome) return parte.slice(i + 1).trim();
  }
  return null;
}

const attrs = (maxAge) => `Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

export function papel(env, email) {
  const e = email.toLowerCase();
  if (lista(env.ADMIN_EMAILS).includes(e)) return "admin";
  if (lista(env.USER_EMAILS).includes(e)) return "usuario";
  return null;
}

function cabecalhos(extra = {}) {
  return {
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-frame-options": "DENY",
    ...extra,
  };
}

function pagina(env, titulo, corpo, status = 200, extra = {}) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titulo)}</title>
<style>:root{color-scheme:light dark}body{font-family:system-ui,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f6f8;color:#0f172a}
@media(prefers-color-scheme:dark){body{background:#0f172a;color:#e2e8f0}.c{background:#1e293b!important}}
.c{background:#fff;padding:32px 28px;border-radius:14px;max-width:360px;width:calc(100% - 32px);box-shadow:0 4px 24px #0002;text-align:center}
h1{font-size:1.25rem;margin:0 0 8px}p{margin:8px 0 20px;opacity:.8;font-size:.95rem}
a.b{display:inline-block;background:#0E6B6B;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600}</style></head>
<body><div class="c">${corpo}</div></body></html>`;
  return new Response(html, { status, headers: cabecalhos({ "content-type": "text/html; charset=utf-8", "cache-control": "no-store", ...extra }) });
}

const telaEntrar = (env, aviso = "") =>
  pagina(env, `Entrar · ${env.APP_NAME}`, `<h1>${esc(env.APP_NAME)}</h1><p>${aviso || "Protótipo com acesso restrito. Entre com a conta Google autorizada."}</p><a class="b" href="/api/auth/login">Entrar com Google</a>`);

export function origem(env, req) {
  return env.APP_ORIGIN || new URL(req.url).origin;
}

async function sessaoDe(env, req) {
  const s = await verificar(env, cookie(req, "sid"));
  if (!s) return null;
  const p = papel(env, s.email); // reavalia a cada pedido: remover o e-mail da lista revoga o acesso na hora
  return p ? { email: s.email, papel: p } : null;
}

async function iniciarLogin(env, req) {
  if (!env.GOOGLE_CLIENT_ID) return pagina(env, "Configuração pendente", "<h1>Login indisponível</h1><p>O login Google ainda não foi configurado para este app.</p>", 503);
  const state = b64u(crypto.getRandomValues(new Uint8Array(24)));
  const u = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  u.search = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: `${origem(env, req)}/api/auth/callback/google`,
    response_type: "code",
    scope: "openid email",
    state,
    prompt: "select_account",
  }).toString();
  const t = await assinar(env, { state, exp: Date.now() / 1000 + 600 });
  return new Response(null, { status: 302, headers: cabecalhos({ location: u.toString(), "set-cookie": `oauth=${t}; ${attrs(600)}`, "cache-control": "no-store" }) });
}

async function callbackGoogle(env, req, fetchFn) {
  const url = new URL(req.url);
  const st = await verificar(env, cookie(req, "oauth"));
  if (!st || !url.searchParams.get("state") || st.state !== url.searchParams.get("state") || !url.searchParams.get("code")) {
    return telaEntrar(env, "Não foi possível concluir o login. Tente de novo.");
  }
  const r = await fetchFn("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: url.searchParams.get("code"),
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${origem(env, req)}/api/auth/callback/google`,
      grant_type: "authorization_code",
    }),
  });
  if (!r.ok) return telaEntrar(env, "O Google recusou o login. Tente de novo.");
  const { id_token } = await r.json();
  let c;
  try {
    c = JSON.parse(new TextDecoder().decode(deb64u(id_token.split(".")[1])));
  } catch {
    return telaEntrar(env, "Resposta inválida do Google.");
  }
  // O id_token veio direto do endpoint do Google por TLS; ainda assim conferimos emissor, público e e-mail verificado.
  const okEmissor = c.iss === "https://accounts.google.com" || c.iss === "accounts.google.com";
  if (!okEmissor || c.aud !== env.GOOGLE_CLIENT_ID || c.email_verified !== true || !c.email) return telaEntrar(env, "Conta Google não verificada.");
  const p = papel(env, c.email);
  if (!p) {
    return pagina(env, "Acesso não autorizado", `<h1>Acesso não autorizado</h1><p>A conta <b>${esc(c.email)}</b> não está liberada para este protótipo.</p><a class="b" href="/api/auth/login">Usar outra conta</a>`, 403, { "set-cookie": `oauth=; ${attrs(0)}` });
  }
  const sid = await assinar(env, { email: c.email.toLowerCase(), exp: Date.now() / 1000 + SESSAO_SEGUNDOS });
  const h = new Headers(cabecalhos({ location: "/", "cache-control": "no-store" }));
  h.append("set-cookie", `sid=${sid}; ${attrs(SESSAO_SEGUNDOS)}`);
  h.append("set-cookie", `oauth=; ${attrs(0)}`);
  return new Response(null, { status: 302, headers: h });
}

export default {
  async fetch(req, env, _ctx, fetchFn = fetch) {
    const url = new URL(req.url);
    // "local" só vale com AMBIENTE=local, que existe apenas no .dev.vars (nunca é publicado; o wrangler.jsonc fixa "producao").
    // Não dá para exigir localhost: o wrangler dev reescreve o host para o domínio da rota.
    const local = env.AMBIENTE === "local";

    if (url.pathname === "/api/auth/login") return iniciarLogin(env, req);
    if (url.pathname === "/api/auth/callback/google") return callbackGoogle(env, req, fetchFn);
    if (url.pathname === "/api/auth/logout") {
      if (req.method !== "POST") return new Response("Método não permitido", { status: 405 });
      return new Response(null, { status: 204, headers: cabecalhos({ "set-cookie": `sid=; ${attrs(0)}` }) });
    }
    // Só no computador do desenvolvedor: entra sem Google para testar (nunca responde fora de localhost).
    if (url.pathname === "/api/auth/dev" && local) {
      const email = (url.searchParams.get("email") ?? "").toLowerCase();
      if (!papel(env, email)) return new Response("e-mail fora das listas", { status: 403 });
      const sid = await assinar(env, { email, exp: Date.now() / 1000 + 3600 });
      return new Response(null, { status: 302, headers: cabecalhos({ location: "/", "set-cookie": `sid=${sid}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600` }) });
    }

    if (PUBLICOS.has(url.pathname)) return env.ASSETS.fetch(req);

    const s = await sessaoDe(env, req);
    if (url.pathname === "/api/me") {
      if (!s) return new Response(JSON.stringify({ erro: "nao_autenticado" }), { status: 401, headers: cabecalhos({ "content-type": "application/json" }) });
      return new Response(JSON.stringify(s), { headers: cabecalhos({ "content-type": "application/json", "cache-control": "no-store" }) });
    }
    if (!s) {
      const querHtml = (req.headers.get("accept") ?? "").includes("text/html");
      return querHtml ? telaEntrar(env) : new Response("Não autenticado", { status: 401, headers: cabecalhos() });
    }

    const resp = await env.ASSETS.fetch(req);
    const h = new Headers(resp.headers);
    h.set("cache-control", "private, no-cache"); // conteúdo restrito: nunca em cache compartilhado
    h.set("x-content-type-options", "nosniff");
    h.set("referrer-policy", "strict-origin-when-cross-origin");
    return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: h });
  },
};
