# Progresso do Tico — estado e próximos passos

> Doc de continuidade: leia isto no início de cada sessão pra ter o contexto de onde paramos.
> **Última atualização:** 10/07/2026

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

### O que ainda é "de mentira" (proposital pro MVP)
- **Estimador de calorias**: roda por um dicionário local em `app/src/lib/estimator.ts` (portado do design). Limitado — só reconhece comidas comuns. **Será trocado por chamada real ao LLM via backend.**
- **Refeições não persistem**: ao recarregar o app, as refeições do dia somem. Só a **meta** persiste (AsyncStorage). Falta persistir as refeições.

---

## Stack e decisões importantes

- **Expo SDK 54** (Router + TypeScript). ⚠️ **Não subir de versão sem checar o Expo Go**: o Expo Go da App Store roda só **um** SDK por vez — hoje o **54** (`expoGoSdkVersion: 54.0.0`). O projeto nasceu no SDK 57 e dava "incompatible" no Expo Go; foi alinhado pro 54. Antes de atualizar SDK, confira em https://api.expo.dev/v2/versions/latest o `expoGoSdkVersion`.
- **NativeWind** (Tailwind v3.4) — tokens de cor do design em `app/tailwind.config.js`. Cores dinâmicas / SVG usam `app/src/lib/theme.ts`.
- **Fontes**: Baloo 2 (títulos/números) e Nunito (corpo), via `@expo-google-fonts`, carregadas em `app/src/app/_layout.tsx`.
- **Reanimated 4.1** (bolinhas da splash) — babel usa `react-native-worklets/plugin`.
- **react-native-svg** (anel de progresso).
- Regras do projeto: ver `CLAUDE.md` na raiz (didático, passos incrementais, commits por bloco responsável, tom "sem culpa", backend sem DDD, **sem comentários no código**).

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
      lib/         theme (tokens+fontes), storage (meta), estimator (simulado)
    assets/tico.png  mascote real (PNG transparente)
  api/             (ainda não existe) backend NestJS — próxima fase
```

---

## Como retomar (rodar o app)

```powershell
cd app
npx expo start -c      # -c limpa o cache do Metro
```
Escanear o QR com a Câmera do iPhone (Expo Go instalado, mesma Wi-Fi). Se a Wi-Fi isolar dispositivos: `npx expo start --tunnel`.

Verificações rápidas: `npx tsc --noEmit` e `npx expo export --platform web`.

---

## Próximas fases / backlog (em ordem sugerida)

- [x] ~~Editar / excluir refeição~~ (PRD 6.4) — **feito**: bottom sheet ao tocar no card.
- [x] ~~Editar a meta diária~~ — **feito**: modal ao tocar no anel.
- [ ] **1. Persistir refeições do dia** (AsyncStorage) — rápido; tira o "some ao recarregar". (a meta já persiste)
- [ ] **2. Backend real** (`api/` NestJS + Prisma + PostgreSQL) + endpoint que chama o LLM e devolve JSON estruturado → substitui o estimador simulado. **Bloco grande: pedir plano antes** (regra do CLAUDE.md). Ver PRD seções 8 e 9.
- [ ] **3. Autenticação** (e-mail/senha + JWT) — PRD 6.6. Vem junto/depois do backend.
- [ ] **4. Ajustes visuais** notados rodando no celular (espaçamentos, tamanhos, etc.).

### Futuro (PRD, não prioritário agora)
Macros, código de barras (Open Food Facts), tabela TACO, histórico de dias, insights "sem culpa", registro por foto, sincronização multi-aparelho.

---

## Convenção de atualização deste doc
Ao terminar um bloco: marcar o item aqui, atualizar "Onde estamos" e a data no topo. Assim o próximo chat começa com o contexto certo.
