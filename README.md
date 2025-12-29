# Hello Cursor 🤖

CLI que gera um relatório diário em Markdown com **clima** e **tarefas do Jira**.

![Preview](https://img.shields.io/badge/Markdown-Preview-blue?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-18+-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square)

## ✨ Features

- 🌤️ **Clima em tempo real** via Open-Meteo (gratuito, sem API key)
- 📍 **Detecção automática** da cidade pelas coordenadas
- 📋 **Tarefas do Jira** agrupadas por projeto e status
- 🔗 **Links clicáveis** para os tickets
- 📄 **Markdown formatado** com tabelas e emojis
- 🖥️ **Abre automaticamente** no preview do Cursor/VS Code

## 🚀 Instalação

```bash
git clone https://github.com/lucasgfabris/hello-cursor.git
cd hello-cursor
npm install
```

O `npm install` configura automaticamente o Cursor para abrir arquivos `.md` no preview.

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
# Coordenadas para o clima (cidade detectada automaticamente)
WEATHER_LATITUDE=33.78476
WEATHER_LONGITUDE=-84.38741

# Jira (opcional - sem configurar usa dados de exemplo)
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui

# Caminho de saída
OUTPUT_PATH=./output
```

### Obtendo o Token do Jira

1. Acesse [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Clique em **Create API token**
3. Copie o token para `JIRA_API_TOKEN`

### Encontrando suas coordenadas

1. Acesse [Google Maps](https://maps.google.com)
2. Clique com botão direito no local desejado
3. Copie as coordenadas (ex: `-20.33, -40.39`)

## 📖 Uso

```bash
npm run hello
```

O relatório é gerado em `./output/relatorio-YYYY-MM-DD.md` e abre automaticamente no preview.

## 📄 Exemplo de Saída

> # 📊 Relatório Diário
>
> > 📅 segunda-feira, 29 de dezembro de 2025 às 13:00
>
> ---
>
> ## 🌤️ Clima em Cariacica - ES
>
> | Métrica | Valor |
> |---------|-------|
> | 🌡️ Temperatura | **36°C** |
> | 🌤️ Condição | Predominantemente limpo |
> | 💧 Umidade | 48% |
>
> ---
>
> ## 📋 Suas tarefas no Jira
>
> **17** tarefas · 🔄 5 em progresso · 📝 12 pendentes
>
> ### 🏷️ Time Payments
>
> #### 🔄 Em Progresso (4)
>
> | Ticket | Descrição |
> |--------|----------|
> | [TAD-1351](#) | Implementar agrupamento |
> | [TAD-1352](#) | Criar Configuration entity |

## 🛠️ Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run hello` | Gera o relatório e abre no preview |
| `npm run build` | Compila o TypeScript |
| `npm start` | Executa sem recompilar |

## 📁 Estrutura

```
hello-cursor/
├── src/
│   ├── index.ts              # Entry point
│   ├── commands/
│   │   ├── weather.ts        # Comando de clima
│   │   └── jira.ts           # Comando de Jira
│   ├── services/
│   │   ├── weather.service.ts # API Open-Meteo + Nominatim
│   │   └── jira.service.ts    # API Jira
│   └── utils/
│       └── env.ts            # Configurações
├── scripts/
│   └── setup.cjs             # Setup automático do Cursor
├── output/                   # Relatórios gerados
├── .env                      # Configurações (não commitado)
└── package.json
```

## 🔧 APIs Utilizadas

| API | Uso | Auth |
|-----|-----|------|
| [Open-Meteo](https://open-meteo.com/) | Clima | Gratuito, sem key |
| [Nominatim](https://nominatim.org/) | Geocoding reverso | Gratuito, sem key |
| [Jira Cloud](https://developer.atlassian.com/cloud/jira/) | Tarefas | API Token |

## 📝 Notas

- Sem configurar o Jira, dados de exemplo são usados
- O relatório é sobrescrito diariamente (mesmo nome por dia)
- Status "Revisar" são ignorados (apenas To Do e In Progress)

## 📜 Licença

MIT
