# Hello Cursor

![GitHub repo size](https://img.shields.io/github/repo-size/lucasgfabris/hello-cursor?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/lucasgfabris/hello-cursor?style=for-the-badge)

> CLI que gera um relatorio diario em Markdown com clima em tempo real e tarefas do Jira. Abre automaticamente no preview do Cursor/VS Code.

<img src="imagem.png" alt="Hello Cursor">

## Pre-requisitos

Antes de comecar, verifique se voce atendeu aos seguintes requisitos:

- Node.js 18 ou superior
- Cursor ou VS Code instalado
- Token de API do Jira (opcional)

## Instalando

Para instalar o Hello Cursor, siga estas etapas:

```bash
git clone https://github.com/lucasgfabris/hello-cursor.git
cd hello-cursor
npm install
```

O `npm install` configura automaticamente o Cursor para abrir arquivos `.md` no preview.

### Configuracao

Crie um arquivo `.env` na raiz do projeto:

```env
# Coordenadas para o clima (cidade detectada automaticamente)
WEATHER_LATITUDE=33.78476
WEATHER_LONGITUDE=-84.38741

# Jira (opcional - sem configurar usa dados de exemplo)
JIRA_BASE_URL=https://sua-empresa.atlassian.net
JIRA_EMAIL=seu-email@empresa.com
JIRA_API_TOKEN=seu_token_aqui

# Caminho de saida
OUTPUT_PATH=./output
```

### Obtendo o Token do Jira

1. Acesse [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Clique em **Create API token**
3. Copie o token para `JIRA_API_TOKEN`

## Usando

Para usar o Hello Cursor, siga estas etapas:

```bash
npm run hello
```

O relatorio e gerado em `./output/relatorio-YYYY-MM-DD.md` e abre automaticamente no preview.

### Exemplo de Saida

```markdown
# Relatorio Diario

> segunda-feira, 29 de dezembro de 2025 as 13:00

## Clima em Cariacica - ES

| Metrica | Valor |
|---------|-------|
| Temperatura | 36C |
| Condicao | Predominantemente limpo |
| Umidade | 48% |

## Suas tarefas no Jira

**17** tarefas - 5 em progresso - 12 pendentes
```

### Scripts Disponiveis

| Comando | Descricao |
|---------|-----------|
| `npm run hello` | Gera o relatorio e abre no preview |
| `npm run build` | Compila o TypeScript |
| `npm start` | Executa sem recompilar |

## Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| Linguagem | TypeScript 5.3 |
| Runtime | Node.js 18+ |
| APIs | Open-Meteo, Nominatim, Jira Cloud |
| HTTP | axios |

## Estrutura do Projeto

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
│       └── env.ts            # Configuracoes
├── scripts/
│   └── setup.cjs             # Setup automatico do Cursor
└── output/                   # Relatorios gerados
```

## Contribuindo

Para contribuir com Hello Cursor, siga estas etapas:

1. Bifurque este repositorio.
2. Crie um branch: `git checkout -b <nome_branch>`.
3. Faca suas alteracoes e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin <nome_branch>`
5. Crie a solicitacao de pull.

## Licenca

Esse projeto esta sob licenca MIT.
