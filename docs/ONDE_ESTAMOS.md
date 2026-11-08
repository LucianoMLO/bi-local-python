
## Migração para o marketplace (2026-11-08)
- Publicação alvo: https://bi-local.fabricasaas.app (Worker com login Google; admin luciano.solucoes.tecnologia@gmail.com, usuário de teste lucianomlo@gmail.com). Skill: `publicar-app-marketplace`.
- Feito localmente: conteúdo higienizado (quando aplicável), `worker/`, `wrangler.jsonc`, testes do Worker (11 passam), smoke com `wrangler dev` (só no quinto_ano).
- Feito na nuvem (2026-11-08): `wrangler deploy` e SESSION_SECRET; login Google responde 503 até GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET serem gravados e a redirect URI ser cadastrada no cliente Google de protótipos; push ao GitHub; cartão publicado no marketplace.
- Falta: Client ID/Secret e redirect URI (dono); testar entrada real com os dois e-mails e 403 para um terceiro. GitHub Pages antigo segue ligado por decisão do dono.
- Aviso: o histórico público do Git ainda contém o conteúdo anterior à limpeza.
