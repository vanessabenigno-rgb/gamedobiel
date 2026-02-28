
# Atualização do Game do Biel - Novas Funcionalidades

## 1. Novas Tabelas no Banco de Dados

Criar 4 novas tabelas sem alterar as existentes. Adicionar campos `essential` e `category` na tabela `tasks`.

**Tabela `rewards`** (Recompensas da Loja)
- id (uuid, PK), name (text), points_required (int), type (text: individual/coletiva), active (boolean, default true)

**Tabela `redemptions`** (Resgates)
- id (uuid, PK), reward_id (uuid, FK -> rewards), date (timestamptz), status (text: pendente/aprovado, default pendente), points_spent (int)

**Tabela `weekly_missions`** (Missao Semanal)
- id (uuid, PK), description (text), goal (int), current_progress (int, default 0), active (boolean, default true), completed (boolean, default false), week_start (date)

**Tabela `achievements`** (Conquistas/Badges)
- id (uuid, PK), name (text), description (text), criteria (text), unlocked (boolean, default false), unlocked_at (timestamptz)

**Alteracao na tabela `tasks`:**
- Adicionar coluna `essential` (boolean, default false)
- Adicionar coluna `category` (text, default 'geral')

Todas com RLS public (mesmo padrão das tabelas existentes).

## 2. Loja de Recompensas

**Nova rota `/loja`** com componente `RewardShop.tsx`:
- Lista de recompensas disponíveis com pontos necessários
- Botão "Resgatar" que cria um registro em `redemptions` com status "pendente"
- Indicador visual de pontos disponíveis vs necessários

**Na tela da mãe:** nova seção "Resgates Pendentes" com botão aprovar (desconta pontos do player_data ao aprovar)

**Novos hooks:** `useRewards`, `useRedemptions`, `useRequestRedemption`, `useApproveRedemption`

## 3. Missão da Semana

**Na tela principal:** card mostrando missão ativa com barra de progresso (ex: "Complete 5 dias esta semana - 3/5")

**Novos hooks:** `useActiveWeeklyMission`, `useUpdateMissionProgress`

Progresso atualizado automaticamente quando tarefas essenciais do dia são todas aprovadas.

## 4. Sistema de Conquistas (Badges)

**Na tela principal:** seção "Minhas Conquistas" mostrando badges desbloqueados e bloqueados (com ícone de cadeado)

**Conquistas iniciais inseridas via migration:**
- "3 Dias Seguidos" (streak >= 3)
- "7 Dias Seguidos" (streak >= 7)
- "100% Escola na Semana" (todas tarefas escola aprovadas seg-sex)
- "10 Dias Completos no Mes" (10+ dias com todas essenciais aprovadas)

**Novos hooks:** `useAchievements`, `useCheckAchievements`

Verificacao de conquistas executada ao aprovar tarefas.

## 5. Notificacoes Motivacionais

Usar `sonner` (toast) para notificacoes no app baseadas em hora:
- **8h:** "Missoes do dia liberadas!"
- **17h:** "Como esta o progresso hoje?"
- **20h30:** "Ultima chamada antes das 21h!"
- **18h sem tarefas:** "Ei, ainda da tempo!"

Implementado via `useEffect` com checagem de hora no `Index.tsx`.

## 6. Tarefas Dinamicas (Tela da Mae)

**Na tela da mae:** botao "Nova Missao" que abre dialog com formulario:
- Nome, Emoji, Pontos, Categoria, Periodicidade (all/weekdays/weekend/once), Essencial (sim/nao)

Inserir diretamente na tabela `tasks` e invalidar queries.

**Logica de "dia completo":** dia so conta como completo se todas tarefas com `essential=true` estiverem aprovadas.

## 7. Arquivos a Criar/Modificar

| Arquivo | Acao |
|---|---|
| Migration SQL | Criar tabelas + alterar tasks |
| `src/hooks/useGameData.ts` | Adicionar hooks para rewards, redemptions, missions, achievements |
| `src/pages/Index.tsx` | Adicionar secoes de missao semanal, conquistas, notificacoes |
| `src/pages/MomDashboard.tsx` | Adicionar resgates pendentes + formulario nova tarefa |
| `src/pages/RewardShop.tsx` | Nova pagina da loja |
| `src/components/game/WeeklyMission.tsx` | Componente missao semanal |
| `src/components/game/AchievementBadges.tsx` | Componente conquistas |
| `src/components/game/CreateTaskDialog.tsx` | Dialog criar tarefa |
| `src/components/game/RedemptionCard.tsx` | Card de resgate pendente |
| `src/App.tsx` | Adicionar rota /loja |
| `src/lib/game-constants.ts` | Adicionar conquistas default |

## Detalhes Tecnicos

- Todas tabelas novas seguem o padrao existente: RLS public, uuid PK com gen_random_uuid()
- Hooks seguem padrao react-query existente em useGameData.ts
- Notificacoes sao client-side (toast baseado em hora), sem push notifications
- Nenhuma tabela ou campo existente sera removido
