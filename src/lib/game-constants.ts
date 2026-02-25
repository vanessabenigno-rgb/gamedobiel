export const LEVELS = [
  { name: "Iniciante", minPoints: 0, emoji: "🌱" },
  { name: "Guardião da Rotina", minPoints: 500, emoji: "🛡️" },
  { name: "Mestre da Disciplina", minPoints: 1000, emoji: "⚔️" },
  { name: "Braço Direito", minPoints: 1500, emoji: "💪" },
  { name: "Lenda da Casa", minPoints: 2000, emoji: "👑" },
];

export const AVATARS = ["🦸", "🧙", "🦹", "🥷", "🧑‍🚀", "🦊", "🐉", "🦁", "🐺", "🦅", "🎮", "⚡"];

export const MOTIVATIONAL_PHRASES = [
  "Bora dominar o dia! 💪",
  "Cada tarefa te deixa mais forte! 🔥",
  "Você é imparável! 🚀",
  "Foco total, campeão! 🎯",
  "Hoje é dia de brilhar! ✨",
  "Nível acima, sempre! ⬆️",
  "A disciplina te leva longe! 🏆",
  "Missão do dia: arrasar! 💥",
  "Consistência é superpoder! ⚡",
  "Vamos que vamos! 🎮",
];

export const MONTHLY_GOAL = 2400;

export const REWARD_TIERS = [
  { percent: 100, value: 60, label: "R$60" },
  { percent: 85, value: 50, label: "R$50" },
  { percent: 70, value: 40, label: "R$40" },
  { percent: 0, value: 0, label: "Sem benefício" },
];

export const STREAK_BONUSES = [
  { days: 15, points: 0, title: "🏅 Lenda da Consistência" },
  { days: 7, points: 100, title: "" },
  { days: 3, points: 30, title: "" },
];

export function getLevel(totalPoints: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVELS[i].minPoints) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getLevelProgress(totalPoints: number) {
  const currentLevel = getLevel(totalPoints);
  const currentIndex = LEVELS.indexOf(currentLevel);
  const nextLevel = LEVELS[currentIndex + 1];
  if (!nextLevel) return 100;
  const range = nextLevel.minPoints - currentLevel.minPoints;
  const progress = totalPoints - currentLevel.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}

export function getRewardTier(monthlyPoints: number) {
  const percent = (monthlyPoints / MONTHLY_GOAL) * 100;
  for (const tier of REWARD_TIERS) {
    if (percent >= tier.percent) return tier;
  }
  return REWARD_TIERS[REWARD_TIERS.length - 1];
}

export function getRandomPhrase() {
  return MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
}

export function isWeekday(date: Date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}
