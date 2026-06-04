# FinanceSecure

FinanceSecure: uma experiência premium de gestão patrimonial que consolida saldos, gastos, receitas e investimentos em uma interface preparada para evolução inteligente.

Construído com **React Native**, **Expo** e **TypeScript**, o projeto adota uma arquitetura modular que isola estritamente a camada visual (telas), as regras de negócio e as integrações com APIs, garantindo escalabilidade e facilidade de manutenção.

#### Principais áreas do app:

- **Início:** resumo financeiro com saldo, receitas, despesas e investimentos.
- **Transações:** cadastro e consulta de movimentações financeiras.
- **Investimentos:** listagem, detalhes, aplicação e resgate.
- **Perfil:** dados do usuário e opções relacionadas à conta.
- **Autenticação:** fluxo de login e cadastro.

## Stack Utilizada

| Área | Tecnologia |
| --- | --- |
| Linguagem | TypeScript |
| Aplicação mobile | React Native com Expo |
| Navegação | Expo Router |
| Dados assíncronos | TanStack React Query |
| Requisições HTTP | Axios |
| Interface | Componentes React Native, Expo Vector Icons e Lottie |

## Arquitetura e Organização

O projeto usa uma arquitetura modular por domínio. Na prática, cada área principal da aplicação possui seus próprios tipos, serviços e hooks, evitando que regras de uma funcionalidade fiquem espalhadas pelo projeto.

Os principais padrões adotados são:

- **Rotas por arquivo:** as telas ficam em `src/app`, seguindo o modelo do Expo Router.
- **Módulos por domínio:** autenticação, dashboard, transações, investimentos e perfil ficam em `src/modules`.
- **Services:** arquivos `*.service.ts` concentram a comunicação com a API.
- **Hooks:** arquivos como `useAuth`, `useInvestments` e `useDashboardSummary` organizam estado, carregamento e cache de dados.
- **Componentes reutilizáveis:** elementos de interface ficam em `src/components`.

Estrutura principal:

```text
src/
├── api/          # Cliente HTTP e tratamento de respostas
├── app/          # Telas e rotas da aplicação
├── components/   # Componentes visuais reutilizáveis
├── constants/    # Tema e constantes do app
├── modules/      # Funcionalidades organizadas por domínio
├── storage/      # Persistência local usada pelo app
├── types/        # Tipos compartilhados
└── utils/        # Funções auxiliares
```

## Navegação

A navegação raiz é definida em `src/app/_layout.tsx`, onde também ficam os provedores globais da aplicação.

A área principal do app usa abas, configuradas em `src/app/(tabs)/_layout.tsx`:

- Início
- Adicionar transação
- Investir
- Perfil

## Configuração da API

O app consome uma API externa por meio do cliente HTTP centralizado em `src/api/httpClient.ts`.

Para apontar o aplicativo para um backend específico, configure a variável
`EXPO_PUBLIC_API_URL` antes de iniciar o Expo ou gerar builds:

```bash
EXPO_PUBLIC_API_URL=https://finsecureapi.onrender.com/api
```

Em desenvolvimento local, use uma URL acessível pelo emulador ou dispositivo
físico e configure-a somente no seu ambiente local. Não deixe URLs locais
hardcoded no código.

O app usa `https://finsecureapi.onrender.com/api` como base pública padrão,
e `EXPO_PUBLIC_API_URL` pode sobrescrever essa URL quando necessário. Em
beta/produção, qualquer URL configurada deve usar HTTPS. Variáveis
`EXPO_PUBLIC_*` são incluídas no bundle do app: não armazene segredos nelas.

## Build beta

O projeto inclui perfis EAS em `eas.json`. Configure a URL HTTPS da API no
ambiente do build e execute:

```bash
npx eas-cli build --platform android --profile preview
```

## Como Executar

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npm start
```

Ou execute diretamente em uma plataforma:

```bash
npm run android
npm run ios
npm run web
```

Depois que o Expo iniciar, é possível abrir o app no emulador, simulador ou em um dispositivo físico pelo Expo Go.

## Evolução planejada

A arquitetura modular atual permite adicionar novos domínios em `src/modules`
sem misturar regras nas telas. Próximos módulos previstos: objetivos financeiros,
importação OFX, recomendações com IA, planos gratuito/pro, assinatura, onboarding
e alertas financeiros. Essas funcionalidades não fazem parte do beta atual.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor do Expo |
| `npm run android` | Abre o app no Android |
| `npm run ios` | Abre o app no iOS |
| `npm run web` | Abre o app no navegador |
| `npm run lint` | Executa a verificação de lint |

## Observações

- O projeto usa aliases de importação, como `@/`, `@components/*` e `@constants/*`.
- O TypeScript está configurado com modo `strict`.
- As respostas da API são tratadas nos services antes de serem usadas pelas telas.
