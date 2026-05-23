# Roadmap: Crie seu Próprio BI Local com Python

**Este é um roadmap de referência** — um mapa das etapas, não um tutorial linha a linha. O objetivo é mostrar o caminho completo para que você saiba o que construir, em que ordem, e quais ferramentas usar em cada fase.

Para cada etapa, use a IA generativa (Claude, ChatGPT) para gerar o código: descreva o que você precisa, cole o script no seu editor e execute. Itere até funcionar.

---

## Fase 1 — Ambiente e estrutura

**O que fazer:**
- Instalar Python 3.11+, VS Code e Git
- Criar a estrutura de pastas do projeto:

```
/bi_local
  /data_lake/raw/       ← arquivos originais (nunca modifique)
  /data_lake/processed/ ← após limpeza inicial
  /data_warehouse/      ← banco SQLite
  /scripts/             ← seus scripts Python
  /output/              ← HTMLs gerados
  /docs/                ← documentação
  /logs/                ← registros de execução
```

- Inicializar repositório Git (`git init`)
- Instalar bibliotecas: `pip install pandas openpyxl plotly jinja2`

**Ferramentas:** Python, VS Code, Git, pip

---

## Fase 2 — ETL: Extração, Transformação e Carga

**O que fazer:**
- Criar `scripts/etl.py` com apoio da IA
- O script deve: ler CSVs/XLSXs do Data Lake, limpar e normalizar dados (CNPJ, datas, valores monetários), fazer joins entre tabelas, e gravar o resultado no banco SQLite

**Prompt modelo para a IA:**
> "Crie um script Python que leia os arquivos [descreva suas fontes], normalize o campo CNPJ removendo pontuação, faça join pelo CNPJ, e salve o resultado em SQLite em [caminho]. Use pandas e sqlite3 com logging em português."

**Validação:** use o DB Browser for SQLite (gratuito) para conferir se os dados estão corretos.

**Ferramentas:** pandas, sqlite3, openpyxl, DB Browser for SQLite

---

## Fase 3 — Data Warehouse e indicadores

**O que fazer:**
- Definir as tabelas do DW: fatos (medidas) e dimensões (categorias)
- Calcular os indicadores de BI diretamente no Python: crescimento, comparativos entre períodos, rankings, inadimplência, saúde do cliente
- Salvar os resultados como tabelas adicionais no SQLite

**Exemplo de estrutura:**
```
fato_indicadores  → receita, inadimplência, NPS por cliente/período
dim_clientes      → cadastro normalizado
dim_unidades      → unidades de negócio
```

---

## Fase 4 — Geração dos relatórios HTML

**O que fazer:**
- Criar `scripts/gerador_bi.py` que lê o DW e gera os HTMLs
- Um arquivo geral (visão consolidada) e um por unidade de negócio
- Incluir: KPIs em cards, gráficos de barras/linhas (Plotly), tabelas com filtro, drill-down por segmento ou categoria

**Prompt modelo para a IA:**
> "Crie um script Python que leia o banco SQLite [caminho], calcule os indicadores [liste os indicadores] e gere um HTML autossuficiente com gráficos Plotly, tabela filtrável e navegação drill-down. Um HTML geral e um por unidade de negócio."

---

## Fase 5 — Pipeline e automação

**O que fazer:**
- Criar `scripts/pipeline.py` que executa ETL → Geração de BI em sequência, com logging de cada etapa
- Agendar no Windows Task Scheduler para rodar automaticamente (ex: 06h diariamente)

**No Agendador de Tarefas:** Criar Tarefa → Gatilho: diariamente 06h → Ação: executar `python C:\bi_local\scripts\pipeline.py`

---

## Fase 6 — Controle de acesso (se necessário)

**Opção simples:** compartilhar pasta de rede com permissões do Windows por usuário.

**Opção com autenticação web:** instalar Caddy ou Nginx (gratuitos) e configurar autenticação HTTP básica por arquivo de relatório. Cada gestor acessa apenas a URL da sua unidade com login e senha.

---

## Fase 7 — Governança e documentação

**Não pule esta etapa:**
- `docs/README.md` — visão geral, como executar, responsável técnico
- `docs/dicionario_de_dados.md` — significado de cada campo e tabela
- `docs/guia_do_usuario.md` — como navegar nos relatórios
- `docs/guia_do_desenvolvedor.md` — como alterar o script para novas necessidades
- Backup automatizado do Data Lake e do arquivo `.db` para local seguro
- Commits regulares no Git com descrição clara das mudanças

---

## Evolução futura

Quando a versão básica estiver estável:
- Migrar para PostgreSQL se o volume crescer
- Integrar com Power BI Desktop conectando direto no SQLite
- Adicionar alertas por e-mail quando indicadores saírem de limites definidos
- Implementar testes automatizados para validar dados após o ETL

---

## Recursos de referência

- [Pandas — documentação](https://pandas.pydata.org/docs/)
- [SQLite com Python](https://docs.python.org/3/library/sqlite3.html)
- [Plotly — galeria](https://plotly.com/python/)
- [Git — guia em português](https://rogerdudler.github.io/git-guide/index.pt_BR.html)
- [DB Browser for SQLite](https://sqlitebrowser.org/)

---

*Material complementar ao artigo "Seu próprio sistema de BI — seguro, gratuito e rodando no seu computador"*  
*Luciano Oliveira — [linkedin.com/in/luciano-oliveira-56378125](https://www.linkedin.com/in/luciano-oliveira-56378125/)*
