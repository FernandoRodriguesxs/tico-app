# Progresso do Tico — estado e próximos passos

> Doc de continuidade: leia isto no início de cada sessão pra ter o contexto de onde paramos.
> **Última atualização:** 15/07/2026

---

## Onde estamos

**Fase 1 (MVP) — as 3 telas — CONCLUÍDA e rodando no iPhone (Expo Go).**

O app foi criado do zero a partir do design `Tico.dc.html` (projeto Claude Design). As 3 telas do design estão implementadas com fidelidade (cores e fontes exatas, mascote real).

Repositório: https://github.com/FernandoRodriguesxs/tico-app (branch `main`).

### O que já funciona
- **Splash** (01): fundo laranja, mascote, "Tico", bolinhas animadas; decide a rota inicial (tem meta salva → Hoje; senão → Onboarding).
- **Onboarding** (02): define a meta diária no stepper `− / +`, salva e vai pra Hoje.
- **Hoje** (03): anel de progresso, pílula de status "sem culpa", feed conversacional (balões + cards de refeição) e input. Registrar refeição soma no anel; passar da meta deixa tudo vermelho. O teclado fecha ao enviar.
- **Editar meta** (Hoje): tocar no anel abre um modal com stepper; salva e persiste.
- **Editar/excluir refeição** (Hoje, tela 04 do design): tocar num card abre um bottom sheet pra ajustar nome/kcal ou excluir.

### Backend v0 — fundação de dados (CONCLUÍDA)
- **PostgreSQL no Neon** (nuvem, região São Paulo), conectado no DBeaver.
- **`api/` com Prisma 6** ligado ao Neon. **Tabelas `User` e `Meal` criadas** (1ª migration `init`).
- **Usuário de teste** semeado: `test-user` (`teste@tico.app`, meta 2000) — dono das refeições até existir login.
- O app ainda NÃO fala com o backend (isso é a próxima fase).

### Backend v1 — API NestJS (CONCLUÍDA)
- **NestJS 11** em `api/` (`controller → service → prisma`, sem DDD).
- Endpoints REST escopados ao `test-user`:
  - `GET/POST/PATCH/DELETE /meals` — o POST estima `food`+`kcal` **no backend** (dicionário portado do app).
  - `GET /me` e `PATCH /me/goal` — ler/mudar a meta.
- **Swagger** em `/docs` (testar a API no navegador). CORS + `ValidationPipe` ligados.
- Verificado via `curl` (todos os endpoints + 400s de validação); banco fica limpo após os testes.
- Ainda **sem login/JWT** e **sem LLM** (a estimativa é o dicionário local, mas agora roda no backend).

### App ↔ API — refeições e meta via backend (CONCLUÍDA, testada no device)
- O app **fala com a API**: no abrir, busca meta (`GET /me`) e refeições do dia (`GET /meals`); registrar/editar/excluir e mudar a meta viram chamadas à API.
- **Refeições PERSISTEM** — fecha e reabre o app e continuam lá (vêm do banco). Fim do "somem ao recarregar".
- URL do backend descoberta sozinha pelo host do Metro (`Constants.expoConfig.hostUri` + porta 3000) — sem `.env` no app, sem IP fixo.
- Novos: `app/src/lib/api.ts` (cliente HTTP) e `app/src/lib/meal-display.ts` (emoji/reply de UI). O `estimator.ts` do app foi **removido** (a estimativa é no backend).
- Tela Hoje ganhou **loading** e **erro** (API fora, com "tentar de novo"); onboarding salva a meta via `PATCH /me/goal`.
- **Logger HTTP** no backend (`api/src/main.ts`): cada request aparece no terminal (`GET /meals 200 - 12ms`).
- ⚠️ **O app agora precisa da API rodando** na mesma Wi-Fi — não funciona mais offline. **Sempre 2 terminais**: API (`npm run start:dev`) + Expo.

### O que ainda é "de mentira" (proposital pro MVP)
- **Estimador de calorias**: dicionário local **no backend** (`api/src/meals/estimator.ts`). Limitado — só comidas comuns. **Será trocado por chamada real ao LLM.**
- **Sem login**: tudo usa o `test-user` fixo. O login (JWT) vem depois.

---

## Stack e decisões importantes

- **Expo SDK 54** (Router + TypeScript). ⚠️ **Não subir de versão sem checar o Expo Go**: o Expo Go da App Store roda só **um** SDK por vez — hoje o **54** (`expoGoSdkVersion: 54.0.0`). O projeto nasceu no SDK 57 e dava "incompatible" no Expo Go; foi alinhado pro 54. Antes de atualizar SDK, confira em https://api.expo.dev/v2/versions/latest o `expoGoSdkVersion`.
- **NativeWind** (Tailwind v3.4) — tokens de cor do design em `app/tailwind.config.js`. Cores dinâmicas / SVG usam `app/src/lib/theme.ts`.
- **Fontes**: Baloo 2 (títulos/números) e Nunito (corpo), via `@expo-google-fonts`, carregadas em `app/src/app/_layout.tsx`.
- **Reanimated 4.1** (bolinhas da splash) — babel usa `react-native-worklets/plugin`.
- **react-native-svg** (anel de progresso).
- Regras do projeto: ver `CLAUDE.md` na raiz (didático, passos incrementais, commits por bloco responsável, tom "sem culpa", backend sem DDD, **sem comentários no código**).
- **Backend: Prisma 6** (fixado — o Prisma 7 muda a mecânica com `prisma.config.ts` + driver adapter; ficamos no 6 por ser mais simples e documentado). Banco no **Neon** (Postgres).
- **`.env` único na raiz** (`tico/.env`, gitignored) com `DATABASE_URL` (conexão **direta** do Neon, sem `-pooler`). Os scripts em `api/` carregam ele via `dotenv-cli` (`dotenv -e ../.env -- ...`).
- **NestJS 11 + TypeScript 5** (o TS 7 nativo ainda não é suportado pelo Nest 11 — fixado no 5). Swagger em `/docs`.

### Gotcha conhecido (Baloo 2)
No RN, `lineHeight == fontSize` corta o topo dos glifos altos da Baloo. Nos números/títulos grandes, usar `lineHeight` folgado (~1.2×).

---

## Estrutura

```
tico/
  docs/            PRD-Tico.md (produto), PROGRESSO.md (este arquivo)
  CLAUDE.md        regras do projeto
  app/             app Expo
    src/
      app/         rotas: _layout, index (splash), onboarding, hoje
      components/  loading-dots, speech-bubble, goal-stepper, primary-button,
                   progress-ring, status-pill, chat-bubble, meal-card, chat-input,
                   goal-editor-modal, meal-editor-modal
      lib/         theme, api (cliente HTTP), meal-display (emoji/reply), storage (flag onboarding)
    assets/tico.png  mascote real (PNG transparente)
  .env             DATABASE_URL do Neon (gitignored — o único .env)
  api/             backend NestJS + Prisma
    src/
      main.ts        bootstrap: Swagger /docs, CORS, validação
      app.module.ts
      prisma/        PrismaModule + PrismaService
      meals/         controller/service/dto + estimator (no backend)
      users/         GET /me, PATCH /me/goal
      common/        TEST_USER_ID
    prisma/
      schema.prisma  models User + Meal
      migrations/    init (cria as tabelas)
      seed.ts        usuário de teste
    package.json     scripts: start/start:dev + generate/migrate/studio/seed (dotenv-cli)
```

---

## Como retomar (rodar o app)

⚠️ Agora precisa de **DOIS terminais** (o app depende da API): um pra API, outro pro Expo. Não use `--tunnel` (quebra a descoberta da URL da API).

**Terminal 1 — API:** `cd api && npm run start:dev`
**Terminal 2 — Expo:**
```powershell
cd app
npx expo start -c      # -c limpa o cache do Metro
```
Escanear o QR com a Câmera do iPhone (Expo Go instalado, mesma Wi-Fi).

Verificações rápidas: `npx tsc --noEmit` e `npx expo export --platform web`.

### Backend (NestJS + Prisma)
```powershell
cd api
npm run start:dev  # sobe a API em http://localhost:3000 (Swagger em /docs)
npm run studio     # abre o Prisma Studio no navegador (ver/editar dados)
npm run migrate    # aplica mudancas de schema (pede --name na 1a vez)
npm run seed       # recria o usuario de teste
```
Precisa do `tico/.env` presente (não vai no git). No DBeaver, dar Refresh na conexão `neondb` pra ver as tabelas. Pra testar a API do **celular**: abrir `http://IP-DO-PC:3000/docs` no Safari (mesma Wi-Fi).

---

## Próximas fases / backlog (em ordem sugerida)

- [x] ~~Editar / excluir refeição~~ (PRD 6.4) — **feito**.
- [x] ~~Editar a meta diária~~ — **feito**.
- [x] ~~Banco + tabelas (Prisma + Neon)~~ — **feito**.
- [x] ~~NestJS + endpoints REST~~ — **feito**: CRUD de refeição + meta, Swagger em `/docs`.
- [x] ~~Ligar o app à API (refeições + meta)~~ — **feito**: persistem no banco; testado no device.
- [ ] **1. Tela de refeições** (ideia nova do Fernando) — uma tela pra **ver as refeições registradas**: **histórico de dias anteriores** (total por dia) **+ uma lista limpa do dia atual** (fora do formato de chat). Envolve: ajuste no backend pra buscar por dia (`GET /meals?date=` ou endpoint de histórico), navegação (aba/botão) e tom "sem culpa" (celebrar consistência, nunca cobrar). Casa com o "Histórico" da Fase 2 do PRD. **Pedir plano antes.**
- [ ] **2. LLM real** no backend (endpoint que recebe texto → JSON estruturado). PRD §8/§9.
- [ ] **3. Autenticação** (e-mail/senha + JWT + tela de login) — PRD 6.6. Troca o `test-user` fixo pelo id do JWT.
- [ ] **4. Ajustes visuais** notados rodando no celular.

### Futuro (PRD, não prioritário agora)
Macros, código de barras (Open Food Facts), tabela TACO, insights "sem culpa", registro por foto, sincronização multi-aparelho.

---

## Convenção de atualização deste doc
Ao terminar um bloco: marcar o item aqui, atualizar "Onde estamos" e a data no topo. Assim o próximo chat começa com o contexto certo.
