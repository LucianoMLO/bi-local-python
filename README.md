# bi-local-python

> 🇧🇷 Este README está disponível em **Português** e **English**.  
> 🇺🇸 This README is available in **Portuguese** and **English**.

---

<details open>
<summary><strong>🇧🇷 Português</strong></summary>

<br>

> Sistema de BI local com Python — Data Lake, ETL, Data Warehouse SQLite e relatórios HTML navegáveis por unidade de negócio. Seguro, gratuito e automatizável via Agendador de Tarefas do Windows.

---

## O problema

Dados espalhados em planilhas, CSVs e sistemas diferentes. Informações sensíveis que não podem sair da organização. Necessidade de cruzar fontes distintas, gerar indicadores por unidade de negócio e compartilhar relatórios com públicos específicos — sem expor a base completa.

A IA generativa ajuda, mas levar dados estratégicos para fora da empresa não é recomendável. Existe uma saída melhor.

---

## A abordagem

Use a IA generativa para **escrever o código** — não para processar os dados. Os dados ficam no seu computador. O script Python gerado pela IA faz todo o trabalho localmente.

```
Fontes de dados (CSVs, XLSXs, sistemas)
        ↓
    Data Lake local  (pastas organizadas)
        ↓
    Script Python    (ETL automatizado)
        ↓
    Data Warehouse   (SQLite / PostgreSQL)
        ↓
    Indicadores de BI
        ↓
    Relatórios HTML navegáveis por unidade
        ↓
    Publicação com autenticação de acesso
```

---

## O que este repositório contém

| Arquivo | Descrição |
|---|---|
| `bi_demo.html` | Dashboard interativo com dados sintéticos — demo do conceito |
| `roadmap_bi_python.md` | Roadmap com as 7 fases para construir sua própria aplicação |

---

## Demo

O arquivo `bi_demo.html` é um dashboard funcional com dados sintéticos que ilustra o conceito:

- Visão geral consolidada com KPIs, gráficos e evolução mensal
- Drill-down por unidade de negócio com tabela de clientes
- Base de clientes com filtros por unidade, segmento e status de CS
- Gerado por script Python a partir de um banco SQLite local

👉 **[Acesse a demo ao vivo — GitHub Pages](https://luciano-oliveira-56378125.github.io/bi-local-python/bi_demo.html)**

---

## Arquitetura resumida

**Data Lake** — estrutura de pastas versionada. Arquivos originais preservados, nunca modificados.

**ETL em Python** — normaliza CNPJs em formatos diferentes, padroniza datas, limpa valores monetários, faz joins entre tabelas. O que levaria horas em planilha, o script resolve em segundos para centenas de milhares de linhas.

**Data Warehouse** — SQLite para a maioria dos projetos (zero instalação, um único arquivo `.db`). PostgreSQL como alternativa para volumes maiores ou acesso multiusuário.

**Relatórios HTML** — gráficos interativos (Plotly / Chart.js), tabelas com filtro, drill-down do nível macro ao unitário. Um arquivo consolidado + um por unidade de negócio, com apenas os dados daquela unidade.

**Automação** — Agendador de Tarefas do Windows executa o pipeline diariamente, sem intervenção manual.

**Controle de acesso** — publicação via Nginx ou Caddy (gratuitos) com autenticação por usuário. Cada gestor acessa apenas o relatório da sua unidade.

---

## O que acelera (muito) a execução

Tecnologia é meio, não fim. A maior vantagem na construção dessas soluções não veio do Python — veio de entender profundamente o negócio: saber quais indicadores importam para a operação, onde está o gargalo no CS, o que o pré-vendas precisa enxergar no dashboard.

Se você tem experiência em gestão, está mais próximo do que imagina de construir sua própria solução. O conhecimento técnico necessário é acessível — e a IA generativa encurta ainda mais esse caminho.

---

## Governança: o que não pode faltar

- Desenho do sistema antes de codar
- Versionamento com Git
- Documentação técnica e guia do desenvolvedor
- Guia do usuário
- Backup automatizado do Data Lake e do banco
- Controle de acesso aos dados brutos por perfil
- Catálogo de dados com o significado de cada campo

---

## Roadmap

Veja o arquivo [`roadmap_bi_python.md`](./roadmap_bi_python.md) para as 7 fases da construção — do ambiente até a publicação com autenticação — com prompts modelo para gerar cada script com apoio de IA.

---

## Recursos úteis

- [Pandas](https://pandas.pydata.org/docs/)
- [SQLite com Python](https://docs.python.org/3/library/sqlite3.html)
- [Plotly](https://plotly.com/python/)
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [Git — guia em português](https://rogerdudler.github.io/git-guide/index.pt_BR.html)

---

## Autor

**Luciano Oliveira** — Gerente Comercial & Consultor  
Experiência em gestão estratégica, CS, vendas e transformação digital orientada a dados.  
Aplicações com essa abordagem rodando em produção nas áreas de Customer Success, pré-vendas e vendas.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Luciano%20Oliveira-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/luciano-oliveira-56378125/)

*Repositório complementar ao artigo ["Seu próprio sistema de BI — seguro, gratuito e rodando no seu computador"](https://www.linkedin.com/in/luciano-oliveira-56378125/) publicado no LinkedIn.*

</details>

---

<details>
<summary><strong>🇺🇸 English</strong></summary>

<br>

> Local BI system built with Python — Data Lake, ETL pipeline, SQLite Data Warehouse and navigable HTML reports per business unit. Secure, free and automatable via Windows Task Scheduler.

---

## The problem

Data scattered across spreadsheets, CSVs and different systems. Sensitive information that cannot leave the organization. The need to cross-reference multiple sources, generate business unit indicators and share reports with specific audiences — without exposing the full dataset.

Generative AI helps, but sending strategic data outside the company is not recommended. There is a better way.

---

## The approach

Use generative AI to **write the code** — not to process the data. The data stays on your computer. The Python script generated by the AI does all the work locally.

```
Data sources (CSVs, XLSXs, systems)
        ↓
    Local Data Lake   (organized folders)
        ↓
    Python Script     (automated ETL)
        ↓
    Data Warehouse    (SQLite / PostgreSQL)
        ↓
    BI Indicators
        ↓
    Navigable HTML reports per business unit
        ↓
    Publication with access authentication
```

---

## What this repository contains

| File | Description |
|---|---|
| `bi_demo.html` | Interactive dashboard with synthetic data — concept demo |
| `roadmap_bi_python.md` | Roadmap with 7 phases to build your own application |

---

## Demo

The `bi_demo.html` file is a functional dashboard with synthetic data illustrating the concept:

- Consolidated overview with KPIs, charts and monthly evolution
- Drill-down by business unit with client table
- Client base with filters by unit, segment and CS status
- Generated by a Python script from a local SQLite database

👉 **[Access the live demo — GitHub Pages](https://luciano-oliveira-56378125.github.io/bi-local-python/bi_demo.html)**

---

## Architecture overview

**Data Lake** — versioned folder structure. Original files preserved, never modified.

**ETL in Python** — normalizes tax IDs (CNPJs) in different formats, standardizes dates, cleans monetary values, joins tables. What would take hours in a spreadsheet, the script handles in seconds for hundreds of thousands of rows.

**Data Warehouse** — SQLite for most projects (zero installation, a single `.db` file). PostgreSQL as an alternative for larger volumes or multi-user access.

**HTML Reports** — interactive charts (Plotly / Chart.js), filterable tables, drill-down from macro to unit level. One consolidated file + one per business unit, containing only that unit's data.

**Automation** — Windows Task Scheduler runs the pipeline daily, without manual intervention.

**Access control** — publication via Nginx or Caddy (both free) with per-user authentication. Each manager accesses only their unit's report.

---

## What accelerates execution (significantly)

Technology is a means, not an end. The greatest advantage in building these solutions did not come from Python — it came from deeply understanding the business: knowing which indicators matter for operations, where the CS bottleneck is, what the pre-sales team needs to see on the dashboard.

If you have management experience, you are closer than you think to building your own solution. The technical knowledge required is accessible — and generative AI shortens that path even further.

---

## Governance: what cannot be skipped

- System design before coding
- Git version control
- Technical documentation and developer guide
- User guide
- Automated backup of Data Lake and database
- Raw data access control by user profile
- Data catalog documenting the meaning of each field

---

## Roadmap

See [`roadmap_bi_python.md`](./roadmap_bi_python.md) for the 7 construction phases — from environment setup to authenticated publication — with prompt templates to generate each script with AI support.

---

## Useful resources

- [Pandas](https://pandas.pydata.org/docs/)
- [SQLite with Python](https://docs.python.org/3/library/sqlite3.html)
- [Plotly](https://plotly.com/python/)
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [Git guide](https://rogerdudler.github.io/git-guide/)

---

## Author

**Luciano Oliveira** — Commercial Manager & Consultant  
Experience in strategic management, CS, sales and data-driven digital transformation.  
Applications using this approach currently running in production across Customer Success, pre-sales and sales.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Luciano%20Oliveira-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/luciano-oliveira-56378125/)

*Companion repository to the article ["Your own BI system — secure, free and running on your computer"](https://www.linkedin.com/in/luciano-oliveira-56378125/) published on LinkedIn.*

</details>
