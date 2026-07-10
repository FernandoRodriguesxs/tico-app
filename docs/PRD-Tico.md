# PRD — Tico: Contador de Calorias Conversacional

**Versão:** 0.2
**Última atualização:** Julho 2026
**Status:** Draft
**Prioridade atual:** Fase 1 (MVP). As fases seguintes ficam documentadas como direção de futuro, mas **não são prioridade agora**.

---

## 1. Visão do Produto

Criar um aplicativo mobile de controle de calorias com **registro conversacional**: o usuário escreve em linguagem natural o que comeu ("comi 2 ovos mexidos e um café com leite") e o Tico estima as calorias na hora, mostrando de forma leve quanto ele já consumiu e quanto falta para a meta do dia.

O produto resolve o maior problema do controle alimentar: **o atrito no registro**. Apps tradicionais obrigam o usuário a buscar cada alimento numa base, ajustar porção em gramas e repetir isso várias vezes por refeição — trabalho chato que faz a maioria desistir na primeira semana. Ao transformar o registro em algo tão simples quanto mandar uma mensagem, e ao adotar um tom **sem culpa**, o Tico remove tanto a barreira prática quanto a emocional.

---

## 2. Problema

Apps de contagem de calorias têm altíssima taxa de abandono. Os principais pontos de dor:

- **Alto atrito para registrar:** buscar alimento → escolher entre dezenas de resultados → ajustar porção → repetir. Cansativo a ponto de ninguém manter por mais de duas semanas.
- **Experiência punitiva:** muitos apps reforçam culpa e vergonha ("você excedeu!"), o que afasta o usuário em vez de ajudá-lo.
- **Bases de dados confusas:** resultados duplicados, valores inconsistentes, produtos que não existem no Brasil.
- **Precisão exigida demais:** a obsessão por gramas exatos gera paralisia; para a maioria, uma boa estimativa rápida vale mais que um número "perfeito" que nunca é registrado.

**Insight central:** o usuário não precisa de precisão de laboratório — precisa de consistência. E só há consistência quando registrar custa quase zero de esforço.

---

## 3. Persona Principal

**Rafael, 29 anos — Desenvolvedor em São Paulo**

- Trabalha sentado, quer perder alguns quilos e entender melhor o que come
- Já tentou MyFitnessPal e planilhas — abandonou todos em menos de duas semanas
- Odeia a fricção: "toda vez que ia registrar o almoço eu já desistia no meio"
- Não quer virar nutricionista, quer só uma noção clara do dia
- É prático e impaciente: se demorar mais que alguns segundos pra registrar, não usa
- **Frase-chave:** "Eu sei mais ou menos o que comi, só não tenho paciência de ficar catalogando grama por grama."

---

## 4. Público-Alvo

- Pessoas de 20-40 anos que querem controlar peso ou alimentação sem virar um projeto de vida
- Quem já tentou apps de calorias e abandonou pelo excesso de trabalho
- Pessoas sensíveis ao tom punitivo dos apps de dieta e que preferem uma abordagem leve
- Early adopters que gostam de automação e praticidade

---

## 5. Objetivos e Métricas de Sucesso

| Objetivo | Métrica | Meta (3 meses) |
|---|---|---|
| Reduzir atrito no registro | Tempo médio para registrar uma refeição | < 10 segundos |
| Registro consistente | Dias com ≥ 1 registro / dias desde o cadastro | > 50% |
| Precisão percebida | % de estimativas aceitas sem correção manual | > 80% |
| Retenção | Retenção D30 | > 25% |
| Satisfação | NPS | > 40 |

> Nota: as metas são propositalmente realistas. Retenção D30 acima de 25% já é boa para app de saúde/consumo; qualquer número muito acima disso na projeção seria otimismo perigoso.

---

## 6. Funcionalidades

> **Como ler esta seção:** a Fase 1 é o que está sendo construído **agora**. As Fases 2 a 4 são direção de produto — ficam registradas para não se perderem, mas **não são prioridade** e podem mudar bastante. Não decidir tudo delas agora é proposital.

### Fase 1 — MVP (PRIORIDADE ATUAL — as 3 telas)

O MVP valida a hipótese central: **as pessoas registram calorias com mais consistência quando podem fazê-lo conversando.**

**6.1 Onboarding — Meta diária**
- Tela única na primeira abertura: definir a meta de calorias do dia (valor sugerido padrão, editável com – / +).
- Mensagem leve do mascote ("dá pra mudar depois, relaxa").

**6.2 Registro por linguagem natural (o coração do produto)**
- O usuário digita o que comeu em texto livre; o Tico estima calorias via IA.

| Mensagem do usuário | Interpretação |
|---|---|
| "comi 2 ovos mexidos e um café com leite" | ~240 kcal |
| "arroz, feijão e frango grelhado" | ~620 kcal |
| "um pão na chapa com manteiga" | ~180 kcal |

Critérios de aceitação:
- A estimativa aparece em **< 5 segundos** após o envio.
- Cada refeição registrada vira um card com o alimento + kcal.
- Quando a IA não tiver confiança suficiente, pede uma confirmação leve antes de gravar ("Isso foi mais tipo 1 ou 2 porções?").
- Se não entender, responde pedindo pra reformular, sem travar o fluxo.

**6.3 Tela "Hoje"**
- Anel de progresso: calorias consumidas vs. meta, com "faltam X kcal".
- Feed de registros do dia (cards de refeição).
- **Estado vazio** amigável com o mascote convidando o primeiro registro.
- **Estado "passou da meta":** anel muda de cor (terracota) e o texto vira "passou X kcal" — informativo, nunca culpado.

**6.4 Editar / excluir refeição**
- Tocar num card permite corrigir a estimativa ou apagar o registro. Essencial porque a IA erra às vezes.

**6.5 Persistência no banco**
- As refeições e a meta são salvas no **PostgreSQL** (via backend NestJS + Prisma). Ver seção 8.

**6.6 Autenticação simples**
- Como os dados vivem num servidor, o app precisa saber de quem é cada refeição. Login básico (e-mail/senha com JWT), no espírito do PRD de referência.
- Pode começar como um único usuário de teste enquanto você aprende o backend, e virar login de verdade quando o fluxo estiver de pé.

**Fora do escopo do v1:** foto do prato, código de barras, macros detalhados, sincronização multi-aparelho avançada, insights.

---

### Fase 2 — Precisão e Velocidade *(futuro, não prioritário)*

- **Macros:** além de kcal, estimar proteína, carboidrato e gordura.
- **Código de barras:** escanear produtos industrializados usando a base **Open Food Facts** (banco gratuito e colaborativo que liga código de barras → informação nutricional; bom acervo brasileiro).
- **Base de alimentos brasileira (TACO):** integrar a **Tabela TACO** (tabela oficial da UNICAMP com a composição de alimentos brasileiros in natura e preparações típicas) para dar números confiáveis de comida caseira e calibrar a IA.
- **Histórico:** navegar por dias anteriores.

### Fase 3 — Inteligência *(futuro, não prioritário)*

- **Insights "sem culpa":** resumos leves ("bateu a meta em 5 dos 7 dias 🎉"), sem linguagem de vergonha.
- **Registro por foto:** tirar foto do prato e o Tico estima o que é e as calorias.
- **Sincronização multi-aparelho:** já que os dados nascem no servidor, expandir para o usuário acessar de mais de um aparelho de forma fluida.

### Fase 4 — Refinamento *(futuro, não prioritário)*

- Metas por macro; sugestão automática de meta a partir de peso/altura/idade/objetivo.
- Onboarding guiado; polimento de UX e performance.

---

## 7. Funcionalidades Futuras (Backlog)

- Registro por voz
- Integração com **Apple Health / Google Fit** (os "cofres de saúde" do iPhone e do Android — o app poderia enviar as calorias e ler peso/atividade de lá, centralizando tudo com smartwatch e outros apps)
- Lembretes inteligentes de registro
- Receitas e refeições favoritas salvas
- Gamificação leve (sequência de dias registrados)
- Compartilhamento com nutricionista

---

## 8. Arquitetura Técnica

**App (mobile)**
- **Expo (React Native)** — um só código para iOS e Android; reaproveita conhecimento de React.
- **Expo Router** — navegação por arquivos, familiar para quem já usa o App Router do Next.js.

**Backend**
- **NestJS** — framework do backend (mesma pilha do PRD de referência, ótimo pra aprender backend "de verdade").
- **Prisma (ORM)** — ponte entre o código e o banco.
- **PostgreSQL** — banco de dados.
- **Autenticação:** login por e-mail/senha com JWT.

> **Recomendação de aprendizado:** comece **sem DDD** — só a estrutura simples de `controller → service → repositório (Prisma)`. O DDD (aquelas camadas todas de use-cases/entities/dtos) resolve problema de time grande e produto maduro; adotar cedo demais só multiplica confusão. Dá pra migrar pra DDD depois, quando o projeto pedir.

**IA (estimativa de calorias)**
- Um endpoint no backend recebe o texto, chama o **LLM** e devolve o JSON estruturado. A **chave da API fica só no backend**, nunca no app.
- **Modelo recomendado para o MVP:** **GPT-4o-mini** ou **GPT-5 nano** (baratíssimos, ótimos em português, e com modo JSON/function calling confiável — o que garante que a resposta volte sempre estruturada). Alternativa igualmente boa: **Gemini Flash-Lite**.
- **Sobre o DeepSeek:** é barato, mas (a) nem é mais o mais barato e (b) os dados trafegam por servidores na China, o que complica a conversa de LGPD com dado de saúde, além de latência menos previsível. Serve pra brincar; para o caminho de produção, prefira as opções acima.
- **Custo:** irrelevante no MVP — cada estimativa é um prompt minúsculo (fração de centavo por registro em qualquer um desses modelos). Não vale otimizar preço agora.

---

## 9. Fluxo de Dados (registro)

```
Usuário digita "comi 2 ovos e um café" no app (Expo)
        ↓
App envia o texto para o backend (NestJS), autenticado por JWT
        ↓
Backend chama o LLM (parsing + estimativa)
        ↓
LLM retorna JSON estruturado:
  { alimento: "2 ovos mexidos + café com leite",
    kcal: 240, proteina: 16, carbo: 6, gordura: 15,
    confianca: 0.9 }
        ↓
Backend valida; se confiança baixa, o app pede confirmação ao usuário
        ↓
Backend salva a refeição no PostgreSQL (via Prisma), vinculada ao usuário
        ↓
App recebe a confirmação e o anel de progresso do dia atualiza na hora
```

**Segurança:** a chave da API de IA vive só no backend, nunca no app. Comunicação por HTTPS, dados isolados por usuário.

---

## 10. Regras de Negócio

- Toda refeição registrada tem: descrição, calorias, data/hora e dono (usuário).
- Se a IA tiver confiança abaixo de ~80%, deve pedir confirmação antes de gravar.
- O total do dia é a soma real das refeições registradas naquela data.
- O usuário pode editar ou excluir qualquer refeição.
- A meta diária é definida no onboarding e editável a qualquer momento.
- Passar da meta é tratado como informação neutra, **nunca como falha** (posicionamento sem culpa).
- Um usuário só acessa as próprias refeições (isolamento por usuário).
- Mensagens não interpretadas são registradas (anonimizadas) para melhoria do modelo.

---

## 11. Privacidade e Conformidade (LGPD)

Dados de alimentação, peso e hábitos são **dados pessoais sensíveis** (relacionados à saúde). Como no Tico os dados já vivem num servidor desde o v1, isso importa desde o começo:

- Base legal clara (consentimento no cadastro) e política de privacidade honesta desde o primeiro lançamento público.
- Dados isolados por usuário; criptografia em trânsito (HTTPS) e em repouso.
- Direito de exportar e excluir a conta e todos os dados.
- Dados enviados ao LLM não devem ser usados para treino de terceiros — verificar os termos do provedor e, se possível, usar endpoints sem retenção.

---

## 12. Monetização

**Decisão adiada — a pensar no futuro.** Não é preocupação do v1. Quando fizer sentido validar, a hipótese de partida é um **freemium** (registros por IA ilimitados, macros, histórico completo e insights no plano pago). Como o custo variável por usuário é muito baixo, o modelo tende a se sustentar — mas isso fica para quando houver uso real para embasar a decisão.

---

## 13. Diferenciais Competitivos

| App | Registro fácil | Tom | Base BR | IA |
|---|---|---|---|---|
| MyFitnessPal | ❌ Busca manual | Neutro | Fraca | ❌ |
| FatSecret | ❌ Busca manual | Neutro | Média | ❌ |
| Yazio | ❌ Busca manual | Punitivo | Média | Parcial |
| **Tico** | ✅ Conversa | **Sem culpa** | ✅ (TACO, futuro) | ✅ |

O diferencial não é o dashboard — é a **combinação de registro conversacional por IA + tom acolhedor "sem culpa"**, num mercado dominado por apps trabalhosos e punitivos.

---

## 14. Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Estimativa de calorias imprecisa | Alto | Alta | Confirmação quando confiança < 80%. Edição fácil no card. Comunicar que é estimativa, não medição. (Bases TACO/Open Food Facts calibram no futuro.) |
| Custo de API de IA por usuário | Médio | Baixa | Modelos baratos (GPT-4o-mini/nano, Gemini Flash-Lite). Prompt minúsculo. Cache de refeições comuns. |
| Estímulo a comportamento alimentar não saudável | Alto | Média | Posicionamento sem culpa. Sem mensagens punitivas. Sem metas perigosamente baixas. |
| Privacidade de dados de saúde (LGPD) | Alto | Baixa | Consentimento, criptografia, isolamento por usuário e exclusão de dados. Sem uso dos dados para treino de terceiros. |
| Baixa retenção após 30 dias | Alto | Média | Reduzir atrito ao máximo, estado vazio convidativo. Medir e iterar. |
| Complexidade do backend atrasar o v1 | Médio | Média | Começar sem DDD; estrutura simples. Focar nas 3 telas antes de qualquer refinamento. |

---

## 15. Roadmap Visual

```
>> AGORA  ██████████████████  Fase 1 — MVP (as 3 telas)
                              Onboarding (meta) + Registro por IA + Tela Hoje
                              Backend NestJS + Prisma + PostgreSQL

   depois  ░░░░░░░░░░░░  Fase 2 — Macros, Código de barras, TACO, Histórico
   depois  ░░░░░░░░░░░░  Fase 3 — Insights, Foto do prato, Sync
   depois  ░░░░░░░░░░░░  Fase 4 — Metas avançadas, Onboarding guiado
```

As fases marcadas com `░` são direção de futuro, **não prioridade**.

---

## 16. Critérios de Go/No-Go

| Transição | Critério para avançar |
|---|---|
| Concluir o v1 | As 3 telas funcionando de ponta a ponta (registro por IA salvando no Postgres e o anel atualizando). |
| v1 → pensar nas próximas fases | Você (e alguns beta testers) registrando de forma consistente por 2+ semanas; ≥ 80% das estimativas aceitas sem correção; vontade real de continuar usando. |

> Só faz sentido investir nas fases futuras depois que o v1 provar que o registro conversacional realmente reduz o atrito na prática.