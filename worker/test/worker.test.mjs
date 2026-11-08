import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { assinar, papel } from "../worker.js";

const env = {
  APP_NAME: "App Teste", AMBIENTE: "producao", APP_ORIGIN: "https://teste.fabricasaas.app",
  ADMIN_EMAILS: "admin@x.com", USER_EMAILS: "user@x.com",
  GOOGLE_CLIENT_ID: "cid", GOOGLE_CLIENT_SECRET: "sec",
  SESSION_SECRET: "x".repeat(40),
  ASSETS: { fetch: async () => new Response("<html>app</html>", { headers: { "content-type": "text/html" } }) },
};
const get = (path, headers = {}) => new Request("https://teste.fabricasaas.app" + path, { headers });
const idToken = (c) => "h." + Buffer.from(JSON.stringify(c)).toString("base64url") + ".s";

test("papéis", () => {
  assert.equal(papel(env, "ADMIN@x.com"), "admin");
  assert.equal(papel(env, "user@x.com"), "usuario");
  assert.equal(papel(env, "outro@x.com"), null);
});

test("sem sessão: navegador vai para a tela de entrada, API recebe 401", async () => {
  const a = await worker.fetch(get("/", { accept: "text/html" }), env);
  assert.equal(a.status, 200);
  assert.match(await a.text(), /Entrar com Google/);
  assert.equal((await worker.fetch(get("/app.js"), env)).status, 401);
  assert.equal((await worker.fetch(get("/api/me"), env)).status, 401);
});

test("arquivos de PWA são públicos", async () => {
  assert.equal((await worker.fetch(get("/manifest.webmanifest"), env)).status, 200);
});

test("sessão válida de admin e de usuário; e-mail removido da lista perde o acesso", async () => {
  for (const [email, p] of [["admin@x.com", "admin"], ["user@x.com", "usuario"]]) {
    const sid = await assinar(env, { email, exp: Date.now() / 1000 + 100 });
    const r = await worker.fetch(get("/", { cookie: `sid=${sid}` }), env);
    assert.equal(r.status, 200);
    assert.equal(r.headers.get("cache-control"), "private, no-cache");
    const me = await (await worker.fetch(get("/api/me", { cookie: `sid=${sid}` }), env)).json();
    assert.equal(me.papel, p);
  }
  const sid = await assinar(env, { email: "user@x.com", exp: Date.now() / 1000 + 100 });
  const r = await worker.fetch(get("/", { cookie: `sid=${sid}`, accept: "text/html" }), { ...env, USER_EMAILS: "" });
  assert.match(await r.text(), /Entrar com Google/);
});

test("cookie adulterado ou expirado é rejeitado", async () => {
  const sid = await assinar(env, { email: "admin@x.com", exp: Date.now() / 1000 + 100 });
  assert.equal((await worker.fetch(get("/", { cookie: `sid=${sid}x` }), env)).status, 401);
  const velho = await assinar(env, { email: "admin@x.com", exp: Date.now() / 1000 - 1 });
  assert.equal((await worker.fetch(get("/", { cookie: `sid=${velho}` }), env)).status, 401);
});

async function fluxo(email, extra = {}) {
  const l = await worker.fetch(get("/api/auth/login"), env);
  assert.equal(l.status, 302);
  const loc = new URL(l.headers.get("location"));
  assert.equal(loc.searchParams.get("redirect_uri"), "https://teste.fabricasaas.app/api/auth/callback/google");
  const state = loc.searchParams.get("state");
  const oauth = l.headers.get("set-cookie").split(";")[0].split("=").slice(1).join("=");
  const fake = async () => new Response(JSON.stringify({ id_token: idToken({ iss: "https://accounts.google.com", aud: "cid", email, email_verified: true, ...extra }) }));
  return worker.fetch(get(`/api/auth/callback/google?code=c&state=${state}`, { cookie: `oauth=${oauth}` }), env, {}, fake);
}

test("callback: e-mail permitido ganha sessão", async () => {
  const r = await fluxo("user@x.com");
  assert.equal(r.status, 302);
  assert.match(r.headers.get("set-cookie"), /sid=.+HttpOnly/);
});
test("callback: e-mail fora da lista recebe 403 e não ganha sessão", async () => {
  const r = await fluxo("intruso@x.com");
  assert.equal(r.status, 403);
  assert.doesNotMatch(r.headers.get("set-cookie") ?? "", /sid=[^;]/);
});
test("callback: aud errado ou e-mail não verificado é recusado", async () => {
  for (const extra of [{ aud: "outro" }, { email_verified: false }]) {
    const r = await fluxo("user@x.com", extra);
    assert.equal(r.status, 200);
    assert.doesNotMatch(r.headers.get("set-cookie") ?? "", /sid=[^;]/);
  }
});
test("callback: state inválido é recusado", async () => {
  const r = await worker.fetch(get("/api/auth/callback/google?code=c&state=falso", { cookie: "oauth=lixo" }), env);
  assert.doesNotMatch(r.headers.get("set-cookie") ?? "", /sid=/);
});
test("login dev só existe com AMBIENTE=local", async () => {
  assert.equal((await worker.fetch(get("/api/auth/dev?email=admin@x.com"), env)).status, 401);
  const loc = { ...env, AMBIENTE: "local" };
  assert.equal((await worker.fetch(get("/api/auth/dev?email=admin@x.com"), loc)).status, 302);
  assert.equal((await worker.fetch(get("/api/auth/dev?email=intruso@x.com"), loc)).status, 403);
});
test("logout exige POST", async () => {
  assert.equal((await worker.fetch(get("/api/auth/logout"), env)).status, 405);
  assert.equal((await worker.fetch(new Request("https://teste.fabricasaas.app/api/auth/logout", { method: "POST" }), env)).status, 204);
});
