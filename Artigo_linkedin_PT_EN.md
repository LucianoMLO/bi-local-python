# Seu próprio sistema de BI — seguro, gratuito e rodando no seu computador
# Your Own BI System — Secure, Free and Running on Your Computer

**Por / By Luciano Oliveira | Gerente Comercial & Consultor / Commercial Manager & Consultant**

---

> 🇧🇷 Este artigo está disponível em **Português** e **English**.
> Clique para ir direto à versão desejada:
> → [Ler em Português](#-versão-em-português)
> → [Read in English](#-english-version)
>
> 🇺🇸 This article is available in **Portuguese** and **English**.
> Click to jump to your preferred version:
> → [Ler em Português](#-versão-em-português)
> → [Read in English](#-english-version)

---

---

## 🇧🇷 Versão em Português

---

Você abre a planilha. São 14 abas. Três formatos de CNPJ diferentes. Dados de clientes misturados com dados financeiros. E alguém acabou de mandar mais um CSV por e-mail.

Esse cenário é mais comum do que deveria ser — e a maioria das empresas ainda resolve isso na mão, horas a fio, com risco de erro e sem rastreabilidade.

A boa notícia: existe uma saída elegante, segura e acessível. E ela não exige comprar nenhuma ferramenta nova.

---

### 1. O problema real: dados espalhados, sensíveis e sem governança

Toda empresa de médio porte convive com uma realidade parecida:

- Dados espalhados em fontes diversas — ERPs, planilhas, CSVs exportados de sistemas legados, relatórios em PDF
- Informações **sensíveis e estratégicas** que não podem sair da organização (CNPJ de clientes, margens, dados de RH, pipeline comercial)
- Necessidade de **cruzar dados** de origens distintas para gerar indicadores táticos e operacionais
- Públicos diferentes que precisam enxergar **recortes diferentes** da mesma base — por unidade de negócio, por regional, por cargo
- Ausência de equipe de TI dedicada para montar uma solução corporativa robusta

A tentação natural é recorrer à IA generativa para automatizar o processamento. Ela realmente ajuda — mas com um risco importante: **levar dados sensíveis para fora da organização**, seja por política interna, regulação (LGPD) ou simplesmente pelo risco de exposição.

Existe uma forma melhor de usar a IA nesse contexto.

---

### 2. Conhecimento de negócio: o diferencial que ninguém menciona

Antes de falar de tecnologia, preciso falar de algo que acelera (e muito) qualquer projeto de dados: **entender o negócio profundamente**.

Tenho construído soluções com essa abordagem ao longo da minha trajetória como gerente comercial e consultor — e o que mais me surpreendeu foi perceber que o maior ganho não veio da tecnologia em si, mas da combinação entre conhecimento de gestão e capacidade técnica.

Saber quais indicadores realmente importam para a operação comercial, como funciona o ciclo de vendas, onde está o gargalo no CS, o que o pré-vendas precisa enxergar no dashboard — isso não se aprende em documentação de Python. Vem de anos gerenciando equipes, construindo processos e entendendo o que move o resultado.

Tenho aplicações rodando hoje em áreas como **Customer Success, pré-vendas e vendas**, todas construídas com essa lógica: scripts Python que eu mesmo desenvolvo para a minha gestão tática e operacional. A tecnologia veio para servir uma necessidade que eu já entendia muito bem — não o contrário.

**A conclusão prática:** se você tem experiência em gestão, está mais próximo do que imagina de construir sua própria solução. O conhecimento técnico necessário é acessível — e a IA generativa encurta ainda mais esse caminho.

---

### 3. A abordagem: IA para construir o script, dados ficam em casa

A chave está em inverter a lógica: em vez de enviar os dados para a IA processar, você usa a IA generativa para **criar o código** que processará os dados localmente, no seu próprio computador.

O fluxo funciona assim:

```
Fontes de dados (CSVs, XLSXs, bancos)
        ↓
    Data Lake local (pastas organizadas)
        ↓
  Script Python (ETL automatizado)
        ↓
   Data Warehouse local (SQLite / PostgreSQL)
        ↓
  Cálculos e indicadores de BI
        ↓
  Relatórios HTML navegáveis por unidade
        ↓
  Publicação com autenticação de acesso
```

Cada etapa é construída com um **prompt bem elaborado para a IA generativa**, que devolve um script Python funcional. Você revisa, ajusta e executa — os dados jamais saem da sua rede.

---

### 4. Arquitetura: as camadas do sistema

#### 4.1 Data Lake — onde os arquivos brutos vivem

Uma estrutura de pastas simples e versionada no seu computador ou servidor interno:

```
/data_lake/
  /clientes/         ← CSVs e XLSXs exportados dos sistemas
  /financeiro/
  /rh/
  /comercial/
  /raw/              ← arquivos originais, nunca modificados
  /processed/        ← arquivos após limpeza inicial
```

**Princípio fundamental:** o arquivo original nunca é alterado. Todo processamento gera um novo arquivo ou escreve no banco. Isso garante rastreabilidade e reversibilidade.

#### 4.2 ETL em Python — Extração, Transformação e Carga

O coração da solução. Um script Python gerado com apoio da IA resolve problemas que na planilha levariam horas:

| Problema comum | O que o script faz |
|---|---|
| CNPJ em 4 formatos diferentes | Normalização automática para 100 mil linhas em segundos |
| Datas em DD/MM/AAAA e AAAA-MM-DD no mesmo arquivo | Tratamento e padronização automáticos |
| Valores com R$, ponto e vírgula misturados | Limpeza em uma linha de código |
| Cruzamento de tabelas por chave composta | Joins estruturados e auditáveis |

Bibliotecas Python utilizadas: `pandas`, `openpyxl`, `sqlite3`, `re`, `os`, `schedule`

#### 4.3 Data Warehouse — onde os dados tratados se consolidam

Para projetos menores e equipes sem infraestrutura de banco de dados, o **SQLite** é suficiente e poderoso: um único arquivo `.db` no computador, sem instalação de servidor, consultável com SQL padrão.

Para volumes maiores ou acesso multiusuário, o **PostgreSQL** gratuito entra como alternativa natural — e o script Python se adapta com mínima alteração.

#### 4.4 Camada de BI — cálculos e indicadores

O mesmo script que carrega os dados faz os cálculos:

- Taxas de crescimento e comparativos entre períodos
- Rankings por unidade, segmento e produto
- Indicadores de saúde do cliente e inadimplência
- Produtividade por unidade e por vendedor

Tudo em Python, rastreável, documentado e versionável.

#### 4.5 Output navegável — HTML com drill-down por unidade

O script gera como resultado final:

- **Um relatório HTML geral** — visão consolidada da organização
- **Um relatório por unidade de negócio** — com apenas os dados daquela unidade
- Gráficos interativos com Plotly ou Chart.js
- Tabelas com filtro e ordenação
- Navegação em drill-down: do nível macro ao unitário, com hierarquia de indicadores

Cada arquivo HTML é autossuficiente — funciona no navegador, sem servidor, sem banco exposto.

#### 4.6 Automação — o script roda sozinho

Com o **Agendador de Tarefas do Windows** (Task Scheduler), você configura o script para rodar automaticamente todo dia às 6h. Nenhum humano precisa intervir. O dashboard está atualizado antes do expediente.

#### 4.7 Publicação com controle de acesso

Para compartilhar os HTMLs com gestores de outras unidades:

- Publicar em servidor web interno com autenticação HTTP básica
- Usar ferramentas gratuitas como **Caddy** ou **Nginx** para controle de acesso por usuário
- Ou compartilhar via rede interna com permissões de pasta por perfil

Cada gestor acessa apenas o arquivo da sua unidade. A base de dados nunca é exposta.

---

### 5. O que a IA generativa faz nesse processo

Ela não toca nos dados. Ela escreve o código.

Com um prompt bem estruturado, você descreve:

- A estrutura das suas fontes de dados
- As transformações necessárias (normalização de CNPJ, limpeza de campos, joins)
- Os indicadores que quer calcular
- O layout do relatório desejado

E recebe de volta um script Python funcional, que você executa localmente. Iterações e ajustes são feitos da mesma forma — você descreve o problema, a IA ajusta o código.

Isso acelera o desenvolvimento **de semanas para dias**, sem exigir que um programador sênior esteja disponível o tempo todo.

---

### 6. Comparativo: e as ferramentas comerciais?

Vale ser honesto sobre as alternativas — e sobre onde cada abordagem faz sentido.

> ⚠️ **Nota:** ferramentas comerciais de BI normalmente envolvem custos de licenciamento por usuário ou por volume de dados, que variam significativamente conforme o fornecedor e o plano contratado.

| | **Power BI / Tableau** | **Looker / Metabase** | **Esta abordagem** |
|---|---|---|---|
| **Curva de aprendizado** | Média | Média–Alta | Média (Python básico) |
| **Dado sai da empresa?** | Sim (nuvem) | Sim (nuvem) | Não |
| **Personalização** | Limitada pelo produto | Média | Total |
| **Manutenção** | Pelo fornecedor | Pelo fornecedor | Sua equipe |
| **Escalabilidade** | Alta | Alta | Média |
| **Tempo para 1ª versão** | 1–2 semanas | 2–4 semanas | 1–3 dias |

**Quando as ferramentas comerciais fazem mais sentido:** empresas com equipes de dados dedicadas, volumes muito grandes, necessidade de colaboração em tempo real e orçamento disponível. Power BI com dados no tenant Microsoft 365 também resolve o problema de segurança, com ressalvas de custo e dependência de licença.

**Quando esta abordagem se destaca:** organizações que não podem ou não querem levar dados para a nuvem, equipes enxutas que precisam de algo funcional rápido, gestores que querem autonomia total sobre o processo analítico — e profissionais que, como eu, preferem construir a ferramenta que serve exatamente ao processo que conhecem.

---

### 7. Governança: o que não pode faltar

A simplicidade da arquitetura não elimina a necessidade de rigor no processo:

| Elemento | Por quê importa |
|---|---|
| **Desenho do sistema antes de codar** | Evita retrabalho e garante escalabilidade |
| **Versionamento do código** (Git) | Permite reverter mudanças e auditar alterações |
| **Documentação técnica** | Garante que outra pessoa possa dar manutenção |
| **Guia do desenvolvedor** | Facilita futuras evoluções do script |
| **Guia do usuário** | Reduz dependência de suporte técnico |
| **Backup automatizado** | Data Lake e Data Warehouse devem ter cópia em local seguro |
| **Controle de acesso aos dados brutos** | Pastas com permissões restritas por perfil |
| **Catálogo de dados** | Documenta o significado de cada campo e tabela |

---

### 8. Para quem essa solução faz sentido

- Gestores e analistas que trabalham com muitas planilhas e precisam consolidar indicadores
- Empresas que não podem (ou não querem) contratar uma solução de BI SaaS por custo ou política de dados
- Profissionais com experiência em negócio que querem construir autonomia analítica
- Equipes que já têm dados organizados mas não têm uma camada analítica sobre eles
- Quem quer aprender engenharia de dados na prática, com um projeto real e útil

---

### 9. Veja funcionando

Para ilustrar o conceito, criei um **dashboard interativo com dados sintéticos** — visão geral, drill por unidade de negócio, base de clientes com filtros, tudo gerado por script Python a partir de um banco SQLite local:

👉 **[Demo: Gestão de Indicadores Comerciais — GitHub Pages](https://lucianomlo.github.io/bi-local-python/)**

O código completo do dashboard e o roadmap de implementação estão disponíveis no repositório:

📁 **[github.com/LucianoMLO/bi-local-python](https://github.com/LucianoMLO/bi-local-python)**

---

### Conclusão

Você não precisa de um orçamento de TI corporativo para ter um sistema de BI funcional, seguro e automatizado. Precisa de clareza sobre o problema, uma arquitetura bem desenhada, e disposição para aprender (ou delegar) o suficiente de Python para colocar o script em produção.

A IA generativa é sua aliada na construção — não no processamento dos dados. Essa distinção muda tudo.

E se você já tem anos de experiência em gestão, saiba: você já tem a parte mais difícil. A parte técnica é mais acessível do que parece.

**👇 O roadmap completo com as etapas de implementação está disponível no repositório:**

📋 [github.com/LucianoMLO/bi-local-python](https://github.com/LucianoMLO/bi-local-python)

---

### Quer criar seu próprio painel?

Você quer criar um painel de indicadores semelhante a este — com estrutura simples de dados comerciais, de CS, RH ou qualquer outra área, a partir dos seus dados de sistema, planilhas ou arquivos .csv?

Estou estruturando **suporte aos interessados aos sábados** para tirar dúvidas e orientar as primeiras etapas. E em breve lanço um **curso rápido: do zero ao seu primeiro BI em HTML** — do Data Lake ao dashboard navegável, sem precisar ser desenvolvedor.

Se tiver interesse, **deixe um comentário ou me mande uma mensagem direta.** 🚀

---

*Luciano Oliveira é gerente comercial e consultor com experiência em gestão estratégica, CS, vendas e transformação digital orientada a dados.*
*Conecte-se: [linkedin.com/in/luciano-oliveira-56378125](https://www.linkedin.com/in/luciano-oliveira-56378125/)*

**#EngenhariaDeDados #BI #Python #DataLake #ETL #GestãoComercial #CustomerSuccess #TransformaçãoDigital #LGPD #DataWarehouse #Automação #GestãoDeVendas**

---

---

## 🇺🇸 English Version

---

You open the spreadsheet. Fourteen tabs. Three different tax ID formats. Customer data mixed with financial records. And someone just sent another CSV by email.

This scenario is more common than it should be — and most companies still handle it manually, hour after hour, with risk of error and no traceability.

The good news: there is an elegant, secure, and accessible way out. And it doesn't require buying any new tools.

---

### 1. The real problem: scattered, sensitive, ungoverned data

Every mid-sized company lives with a similar reality:

- Data scattered across multiple sources — ERPs, spreadsheets, CSVs exported from legacy systems, PDF reports
- **Sensitive and strategic information** that cannot leave the organization (customer tax IDs, margins, HR data, commercial pipeline)
- The need to **cross-reference data** from different sources to generate tactical and operational indicators
- Different audiences that need to see **different slices** of the same dataset — by business unit, region, or role
- No dedicated IT team to build a robust corporate solution

The natural temptation is to use generative AI to automate processing. It really does help — but with an important risk: **sending sensitive data outside the organization**, whether due to internal policy, regulation (LGPD/GDPR), or simply the risk of exposure.

There is a better way to use AI in this context.

---

### 2. Business knowledge: the differentiator nobody talks about

Before talking about technology, I need to address something that dramatically accelerates any data project: **deeply understanding the business**.

I have built solutions with this approach throughout my career as a commercial manager and consultant — and what surprised me most was realizing that the greatest gain didn't come from the technology itself, but from the combination of management knowledge and technical capability.

Knowing which indicators truly matter for commercial operations, how the sales cycle works, where the CS bottleneck is, what the pre-sales team needs to see on the dashboard — none of that comes from Python documentation. It comes from years managing teams, building processes, and understanding what drives results.

I currently have applications running in areas such as **Customer Success, pre-sales, and sales**, all built with this logic: Python scripts I develop myself for my own tactical and operational management. The technology came to serve a need I already understood well — not the other way around.

**The practical conclusion:** if you have management experience, you are closer than you think to building your own solution. The required technical knowledge is accessible — and generative AI shortens that path even further.

---

### 3. The approach: AI builds the script, data stays home

The key is to invert the logic: instead of sending data to the AI for processing, you use generative AI to **create the code** that will process the data locally, on your own computer.

The flow works like this:

```
Data sources (CSVs, XLSXs, databases)
        ↓
    Local Data Lake (organized folders)
        ↓
  Python Script (automated ETL)
        ↓
   Local Data Warehouse (SQLite / PostgreSQL)
        ↓
  BI calculations and indicators
        ↓
  Navigable HTML reports per unit
        ↓
  Publication with access authentication
```

Each step is built with a **well-crafted prompt to the generative AI**, which returns a functional Python script. You review, adjust, and execute — the data never leaves your network.

---

### 4. Architecture: the system layers

#### 4.1 Data Lake — where raw files live

A simple, versioned folder structure on your computer or internal server:

```
/data_lake/
  /customers/        ← CSVs and XLSXs exported from systems
  /financial/
  /hr/
  /commercial/
  /raw/              ← original files, never modified
  /processed/        ← files after initial cleaning
```

**Core principle:** the original file is never altered. All processing generates a new file or writes to the database. This ensures traceability and reversibility.

#### 4.2 ETL in Python — Extract, Transform, Load

The heart of the solution. A Python script generated with AI support solves problems that would take hours in a spreadsheet:

| Common problem | What the script does |
|---|---|
| Tax IDs in 4 different formats | Automatic normalization for 100k rows in seconds |
| Dates in DD/MM/YYYY and YYYY-MM-DD in the same file | Automatic detection and standardization |
| Monetary values with mixed symbols and separators | Cleaned in one line of code |
| Cross-referencing tables by composite key | Structured, auditable joins |

Python libraries used: `pandas`, `openpyxl`, `sqlite3`, `re`, `os`, `schedule`

#### 4.3 Data Warehouse — where treated data consolidates

For smaller projects and teams without database infrastructure, **SQLite** is sufficient and powerful: a single `.db` file on your computer, no server installation required, queryable with standard SQL.

For larger volumes or multi-user access, free **PostgreSQL** is a natural alternative — and the Python script adapts with minimal changes.

#### 4.4 BI layer — calculations and indicators

The same script that loads the data performs the calculations:

- Growth rates and period-over-period comparisons
- Rankings by unit, segment, and product
- Customer health indicators and delinquency rates
- Productivity by unit and by salesperson

Everything in Python — traceable, documented, and versionable.

#### 4.5 Navigable output — HTML with drill-down by unit

The script generates as its final output:

- **One general HTML report** — consolidated view of the organization
- **One report per business unit** — containing only that unit's data
- Interactive charts with Plotly or Chart.js
- Filterable and sortable tables
- Drill-down navigation: from macro level to individual, with indicator hierarchy

Each HTML file is self-contained — works in the browser, no server, no exposed database.

#### 4.6 Automation — the script runs itself

With the **Windows Task Scheduler**, you configure the script to run automatically every day at 6 AM. No human intervention needed. The dashboard is updated before the workday begins.

#### 4.7 Publication with access control

To share HTML files with managers from other units:

- Publish on an internal web server with basic HTTP authentication
- Use free tools such as **Caddy** or **Nginx** for per-user access control
- Or share via internal network with folder-level permissions by profile

Each manager accesses only their unit's file. The database is never exposed.

---

### 5. What generative AI does in this process

It doesn't touch the data. It writes the code.

With a well-structured prompt, you describe:

- The structure of your data sources
- The required transformations (tax ID normalization, field cleaning, joins)
- The indicators you want to calculate
- The desired report layout

And you receive back a functional Python script, which you run locally. Iterations and adjustments follow the same pattern — you describe the problem, the AI adjusts the code.

This accelerates development **from weeks to days**, without requiring a senior developer to be available at all times.

---

### 6. Comparison: what about commercial tools?

It's worth being honest about the alternatives — and where each approach makes sense.

> ⚠️ **Note:** commercial BI tools typically involve licensing costs per user or per data volume, which vary significantly depending on the vendor and plan.

| | **Power BI / Tableau** | **Looker / Metabase** | **This approach** |
|---|---|---|---|
| **Learning curve** | Medium | Medium–High | Medium (basic Python) |
| **Data leaves the company?** | Yes (cloud) | Yes (cloud) | No |
| **Customization** | Limited by product | Medium | Total |
| **Maintenance** | By vendor | By vendor | Your team |
| **Scalability** | High | High | Medium |
| **Time to first version** | 1–2 weeks | 2–4 weeks | 1–3 days |

**When commercial tools make more sense:** companies with dedicated data teams, very large volumes, real-time collaboration needs, and available budget. Power BI with data in a Microsoft 365 tenant also addresses the security concern, with caveats around cost and license dependency.

**When this approach stands out:** organizations that cannot or do not want to send data to the cloud, lean teams that need something functional quickly, managers who want full autonomy over the analytical process — and professionals who, like me, prefer to build the tool that serves exactly the process they know.

---

### 7. Governance: what cannot be skipped

The simplicity of the architecture does not eliminate the need for rigor in the process:

| Element | Why it matters |
|---|---|
| **System design before coding** | Prevents rework and ensures scalability |
| **Code versioning** (Git) | Allows reverting changes and auditing history |
| **Technical documentation** | Ensures someone else can maintain it |
| **Developer guide** | Facilitates future script evolution |
| **User guide** | Reduces dependency on technical support |
| **Automated backup** | Data Lake and Data Warehouse must have copies in a secure location |
| **Raw data access control** | Folders with permissions restricted by profile |
| **Data catalog** | Documents the meaning of each field and table |

---

### 8. Who this solution is right for

- Managers and analysts working with many spreadsheets who need to consolidate indicators
- Companies that cannot (or do not want to) contract a BI SaaS solution due to cost or data policy
- Professionals with business experience who want to build analytical autonomy
- Teams that already have organized data but lack an analytical layer on top of it
- Anyone who wants to learn data engineering in practice, with a real and useful project

---

### 9. See it in action

To illustrate the concept, I created an **interactive dashboard with synthetic data** — overview, drill-down by business unit, client base with filters, all generated by a Python script from a local SQLite database:

👉 **[Demo: Commercial Indicators Management — GitHub Pages](https://lucianomlo.github.io/bi-local-python/)**

The complete dashboard code and implementation roadmap are available in the repository:

📁 **[github.com/LucianoMLO/bi-local-python](https://github.com/LucianoMLO/bi-local-python)**

---

### Conclusion

You don't need a corporate IT budget to have a functional, secure, and automated BI system. You need clarity about the problem, a well-designed architecture, and willingness to learn (or delegate) enough Python to put the script into production.

Generative AI is your ally in building it — not in processing the data. That distinction changes everything.

And if you already have years of management experience, know this: you already have the hardest part. The technical side is more accessible than it seems.

**👇 The complete implementation roadmap is available in the repository:**

📋 [github.com/LucianoMLO/bi-local-python](https://github.com/LucianoMLO/bi-local-python)

---

### Want to build your own dashboard?

Do you want to create an indicators panel similar to this one — with a simple structure of commercial, CS, HR, or any other area data, from your system exports, spreadsheets, or .csv files?

I am organizing **Saturday support sessions** for those getting started, and will soon launch a **quick course: from zero to your first HTML BI dashboard** — from Data Lake to navigable dashboard, no prior development experience required.

If you're interested, **leave a comment or send me a direct message.** 🚀

---

*Luciano Oliveira is a commercial manager and consultant with experience in strategic management, CS, sales and data-driven digital transformation.*
*Connect: [linkedin.com/in/luciano-oliveira-56378125](https://www.linkedin.com/in/luciano-oliveira-56378125/)*

**#DataEngineering #BI #Python #DataLake #ETL #CommercialManagement #CustomerSuccess #DigitalTransformation #DataWarehouse #Automation #SalesManagement**
