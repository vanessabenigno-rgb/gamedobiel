# Biel's Daily Quest

Crie um web app simples estilo game chamado "Game do Biel".

Objetivo:
Sistema de responsabilidade diária para um adolescente de 12 anos.

Regras principais:

O dia encerra às 21h.

Tarefas não aprovadas até 21h contam como não concluídas.

Usuário marca como concluído.

A mãe precisa aprovar manualmente.

Só após aprovação os pontos são adicionados.

Funcionalidades obrigatórias:

Tela Principal:

Avatar

Nível

Pontos acumulados no mês

Barra de progresso do dia

Lista de tarefas do dia

Status visual por cor:

Vermelho: pendente

Amarelo: aguardando aprovação

Verde: aprovado

Contador regressivo até 21h

Tela da Mãe:

Lista de tarefas aguardando aprovação

Botão Aprovar

Gráfico semanal de desempenho

Percentual mensal

Visualização de streak

Sistema de Pontuação:
Tarefas e pontos:

Fazer tarefa da escola (seg-sex): 20 pontos

Banho manhã: 10 pontos

Banho noite: 10 pontos

Escovar dentes manhã: 5 pontos

Escovar dentes noite: 5 pontos

Arrumar quarto: 15 pontos

Lavar louça: 15 pontos

Guardar louça: 10 pontos

Encher garrafas: 10 pontos

Meta mensal:
2400 pontos = R$60

Recompensa proporcional:

100% = 60

85% = 50

70% = 40

abaixo de 70% = perde benefício

Sistema de níveis:
Subir de nível a cada 500 pontos.
Nomes dos níveis:

Iniciante

Guardião da Rotina

Mestre da Disciplina

Braço Direito

Lenda da Casa

Sistema de streak:

3 dias completos seguidos = +30 pontos

7 dias = +100 pontos

15 dias = título especial

Estilo visual:

Interface estilo game

Visual amigável

Barra de progresso animada

Avatar personalizável

Frases motivacionais automáticas

Web app responsivo para celular.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://gamedobiel.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/167c3c37-b18d-48e6-bb68-040b1d6f0a2c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
