
## Migração para o marketplace (2026-11-08)
- Publicação alvo: https://bi-local.fabricasaas.app (Worker com login Google; admin luciano.solucoes.tecnologia@gmail.com, usuário de teste lucianomlo@gmail.com). Skill: `publicar-app-marketplace`.
- Feito localmente: conteúdo higienizado (quando aplicável), `worker/`, `wrangler.jsonc`, testes do Worker (11 passam), smoke com `wrangler dev` (só no quinto_ano).
- NÃO feito (precisa de aprovação): redirect URI no cliente Google, `wrangler secret put` (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET), `wrangler deploy`, push ao GitHub, desligar o GitHub Pages, publicar o cartão no marketplace.
- Aviso: o histórico público do Git ainda contém o conteúdo anterior à limpeza.
