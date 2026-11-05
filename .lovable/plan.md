# Reformulação: Autonomia e Tempo de Telas

## Diagnóstico do app atual

**O que existe hoje**
- Tarefas cadastradas (nome, pontos, dias da semana, categoria, essencial) e geração automática das tarefas do dia.
- Biel marca "Concluí", a mãe aprova e os pontos são somados.
- Pontos, níveis, sequência (streak), meta mensal em R$, loja de recompensas, resgates, conquistas e missão semanal.
- Contagem regressiva até 21h e alertas do navegador.
- Painel da mãe protegido por PIN (1234).

**Problemas encontrados**
- **Não há login.** Qualquer pessoa com o link pode ler e alterar tudo. O PIN é conferido no próprio aparelho e pode ser lido por quem abrir o app — hoje Biel conseguiria aprovar as próprias tarefas. Isso impede cumprir "Gabriel não pode aprovar" e "só a mãe altera regras".
- O dia é calculado pelo relógio do aparelho, não pelo fuso de Fortaleza.
- Tarefas "fim de semana" e "única vez" aparecem todos os dias (regra não aplicada).
- Pontos, níveis, loja, conquistas e R$ contrariam o novo objetivo (sem moedas, lojas ou prêmios).

**O que dá para reaproveitar**
- Cadastro de tarefas (vira "Responsabilidades habituais").
- Tarefas do dia + fluxo marcar/aprovar.
- Contagem até 21h, alertas, tema visual escuro.
- Formulário "Nova Missão" e a tela de gerenciar (adaptada para atividades de minutos).

## Plano de alterações

### 1. Segurança (necessária para as regras)
- Criar login com dois perfis: **Mãe (responsável)** e **Gabriel**.
- Permissões guardadas no servidor: só a mãe aprova, recusa, altera minutos, limites e regras. Gabriel só registra e vê os próprios dados.
- O PIN deixa de ser usado.

### 2. Tempo de telas
- 60 min garantidos + até 120 min extras por dia (ambos editáveis pela mãe).
- Mostrar: conquistados, aguardando aprovação, disponíveis, já usados (a mãe registra o uso).
- Minutos zeram a cada dia (fuso Fortaleza). O app só registra — não libera aparelhos.
- Minutos extras ficam "aguardando regularização" enquanto houver pendência escolar do dia.

### 3. Minha Escola
- Registro diário: atividades feitas, pendências, matérias estudadas, dificuldades, "preciso de ajuda".
- Não gera minutos; a mãe valida.

### 4. Responsabilidades domésticas
- **Habituais**: tarefas atuais, sem minutos.
- **Iniciativas espontâneas**: tabela de atividades com minutos editáveis (sugestões iniciais: garrafas +10, lixo +15, louça sem cobrança +20, guardar louça +10, quarto +15, outra necessidade +15).
- Botão grande **"Registrar minha iniciativa"** (2 cliques: escolher atividade, descrição opcional, enviar). Registro guarda atividade, horário, descrição, minutos previstos e status.
- Anti-repetição: limite de vezes por dia por atividade (padrão 1, editável) e intervalo mínimo entre registros.

### 5. Validação pela mãe
- Aprovar, recusar com motivo, ou pedir correção (volta para Gabriel editar).
- Só aprovadas somam minutos, sempre respeitando o limite diário.
- Mãe registra "lembretes necessários" com um toque.

### 6. Check-in diário
- Gabriel responde as 4 perguntas antes das 21h; a mãe visualiza e valida.

### 7. Painéis
- **Gabriel**: responsabilidades do dia, pendências escolares, iniciativas, minutos, tempo disponível, evolução da semana.
- **Mãe**: resumo do dia, pendências escolares, tarefas feitas, iniciativas, aprovações, tempo autorizado, histórico e indicadores (dias com escola em dia, iniciativas, lembretes, evolução).

### 8. Revisão semanal
- Tela comum: escola, iniciativas, pendências recorrentes, dias em que cumpriu os combinados, comparação com a semana anterior.

### 9. O que sai da tela (sem apagar dados)
- Pontos, níveis, loja, resgates, conquistas, missão semanal e meta em R$ ficam escondidos. Tabelas e registros antigos permanecem guardados.

## Detalhes técnicos
- Novas tabelas: user_roles (mãe/filho), screen_time_settings, initiative_activities, initiative_logs, school_logs, daily_checkins, screen_time_usage, reminders. Tabelas existentes não são alteradas nem apagadas; apenas as permissões abertas atuais serão substituídas por permissões por perfil (mudança estrutural — precisa da sua aprovação).
- Cálculo de minutos e limite feito no servidor (função), com índice único para evitar duplicatas.
- "Dia" calculado em America/Fortaleza no servidor.

## Decisões que preciso de você
1. Gabriel terá login próprio (e-mail ou usuário) ou usa o app no mesmo aparelho com perfil selecionado? Recomendo login próprio.
2. Posso esconder pontos/níveis/loja da tela (dados preservados)?
3. Quantas vezes por dia cada iniciativa pode ser registrada (padrão: 1)?
