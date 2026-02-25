
# 🎮 Game do Biel

App gamificado de responsabilidade diária para um adolescente de 12 anos, com visual moderno e colorido, estilo mobile-first.

---

## 1. Configuração do Banco de Dados (Supabase)

- **Tabela `tasks`**: tarefas-modelo com nome, pontos e dias da semana (seg-sex ou todos)
- **Tabela `daily_tasks`**: instâncias diárias de cada tarefa, com status (pendente / aguardando / aprovado), data e hora de conclusão
- **Tabela `user_data`**: perfil do jogador (avatar selecionado, streak atual, pontos acumulados)
- **PIN da mãe**: armazenado de forma simples no banco para validação de acesso

---

## 2. Tela Principal (Biel)

- **Header gamificado**: avatar com moldura colorida, nome do nível atual, pontos do mês
- **Barra de progresso do dia** animada mostrando tarefas concluídas vs total
- **Contador regressivo** até as 21h com visual de timer
- **Lista de tarefas** com cards coloridos por status:
  - 🔴 Vermelho = pendente
  - 🟡 Amarelo = aguardando aprovação da mãe
  - 🟢 Verde = aprovado
- Botão "Concluí!" em cada tarefa pendente
- **Frase motivacional** aleatória no topo
- **Indicador de streak** (dias consecutivos completos)

---

## 3. Tela da Mãe (acesso por PIN de 4 dígitos)

- Tela de digitação de PIN para entrar
- **Lista de tarefas aguardando aprovação** com botão "Aprovar" em cada uma
- **Gráfico semanal** de desempenho (barras com pontos por dia)
- **Percentual mensal** com barra de progresso e indicador da faixa de recompensa (R$60 / R$50 / R$40)
- **Visualização de streak** atual e melhor streak

---

## 4. Sistema de Pontuação

Tarefas pré-configuradas com seus pontos:
| Tarefa | Pontos | Dias |
|---|---|---|
| Tarefa da escola | 20 | Seg-Sex |
| Banho manhã | 10 | Todos |
| Banho noite | 10 | Todos |
| Escovar dentes manhã | 5 | Todos |
| Escovar dentes noite | 5 | Todos |
| Arrumar quarto | 15 | Todos |
| Lavar louça | 15 | Todos |
| Guardar louça | 10 | Todos |
| Encher garrafas | 10 | Todos |

Meta mensal: 2400 pontos com recompensas proporcionais.

---

## 5. Sistema de Níveis e Streaks

- **Níveis** a cada 500 pontos: Iniciante → Guardião da Rotina → Mestre da Disciplina → Braço Direito → Lenda da Casa
- **Bônus de streak**: 3 dias = +30pts, 7 dias = +100pts, 15 dias = título especial
- Lógica de reset de streak às 21h se dia não completado

---

## 6. Design Visual

- Cores vibrantes com gradientes (roxo, azul, verde)
- Cards com sombras suaves e bordas arredondadas
- Animações na barra de progresso e ao aprovar tarefas
- Emojis e ícones lúdicos
- Layout 100% responsivo para celular
- Seleção de avatar entre opções pré-definidas (emojis de personagens)
