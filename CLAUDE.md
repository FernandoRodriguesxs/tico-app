# Tico — Contexto do Projeto

Tico é um app mobile de contagem de calorias com registro conversacional:
o usuário escreve o que comeu em linguagem natural e a IA estima as calorias.
Leia o PRD em `docs/PRD-Tico.md` para o contexto completo do produto.

## Sobre mim
Sou desenvolvedor e já conheço Next.js/React, mas estou APRENDENDO
desenvolvimento mobile e backend. Explique o que está fazendo e o porquê,
em vez de só despejar código. Prefiro passos pequenos e incrementais e seja sempre didatico.

## Stack
- App: Expo (React Native) + Expo Router + TypeScript — **Expo SDK 57**. O Expo muda muito entre versões: na dúvida, consulte a doc da versão em https://docs.expo.dev/versions/v57.0.0/ antes de escrever código.
- Backend: NestJS + Prisma + PostgreSQL
- IA: chamada a um LLM (GPT-4o-mini / GPT-5 nano) para estimar calorias
- Idioma da interface e das mensagens: Português do Brasil

## Estrutura de pastas
- `app/`   -> o aplicativo Expo
- `api/`   -> o backend NestJS
- `docs/`  -> PRD e documentação
- `design/`-> imagens de referência das telas

## Regras de código
- Tamanho de Componentes Max 200 linhas por componente (sem contar comentarios e linhas em branco)
Se passar de 200, extrair em subcomponentes ou hooks
- NUNCA usar console.log em producao
- TypeScript sempre; não adicione `any`.
- Backend SEM DDD por enquanto: só `controller -> service -> prisma`.
  Mantenha simples; não crie camadas ou abstrações que o PRD não pediu.
- Nomes de arquivos em kebab-case; variáveis/funções em camelCase.
- Componentes pequenos e legíveis; um componente por arquivo.
- Use Prettier + ESLint (configuração padrão do Expo/Nest).
- No app, todo acesso a dados passa por uma camada de serviço/cliente; nunca `fetch` direto dentro de componentes.
- Commits no formato Conventional Commits (feat:, fix:, chore:...), **um commit por bloco responsável**: agrupe as mudanças por módulo/área e use o escopo pra nomeá-lo (ex.: `feat(onboarding): ...`, `feat(hoje): ...`, `chore(config): ...`). Não misture blocos diferentes no mesmo commit.

### Princípios
- **KISS** — Mantenha simples. Soluções simples são mais fáceis de manter.
- **DRY** — Não repita lógica. Extraia funções reutilizáveis.
- **YAGNI** — Não implemente o que não foi pedido.
- **SOLID** — Siga os princípios SOLID.
- **Early Return** — Trate erros no início, retorne cedo.
- **Fail Fast** — Valide inputs imediatamente, falhe rápido.

### Estilização (app Expo)
- **NativeWind** (Tailwind adaptado pro React Native) para estilizar as telas.
- Tokens de design (cores, espaçamentos) definidos no `tailwind.config.js` do NativeWind.
- Usar nomes de cores semânticos (os que já existem: `brand`, `cream`/surface, `ink`/texto, `muted`, `over`, `success`).
- Cores dinâmicas ou props de SVG (stroke/fill) usam as constantes de `src/lib/theme.ts`.
- Nada de CSS puro, `@theme` de Tailwind web ou CSS variables — não funcionam em React Native.


## Segurança
- NUNCA commitar .env, secrets, tokens, API keys ou passwords

## Tom do produto ("sem culpa")
- As mensagens do app são leves e acolhedoras, nunca punitivas.
- Passar da meta é informação neutra, jamais tratado como falha.

## Como trabalhar comigo
- Antes de mexer em muitos arquivos, me diga o plano usando o plan mode pra ser melhor desenvolvido.
- Faça uma coisa de cada vez e me deixe testar antes de seguir.
- Nunca use gambiarras no desenvolvimento, sempre seguindo padrões corretos.
- Se algo tiver mais de um caminho, me pergunte antes de escolher.