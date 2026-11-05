export const TZ = "America/Fortaleza";

/** Today's date (yyyy-MM-dd) in Fortaleza time. */
export function fortalezaToday(d: Date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Monday of the week containing dateStr. */
export function weekStart(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00Z");
  const dow = (d.getUTCDay() + 6) % 7;
  return addDays(dateStr, -dow);
}

export function weekDays(start: string) {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export interface MinuteInput {
  base: number;
  maxExtra: number;
  approved: number[];
  pending: number[];
  used: number[];
  schoolBlocked: boolean;
}

export function computeMinutes({ base, maxExtra, approved, pending, used, schoolBlocked }: MinuteInput) {
  const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);
  const earned = Math.min(sum(approved), maxExtra);
  const waiting = sum(pending);
  const usedTotal = sum(used);
  const unlockedExtra = schoolBlocked ? 0 : earned;
  const available = Math.max(0, base + unlockedExtra - usedTotal);
  return { earned, waiting, used: usedTotal, available, blockedExtra: schoolBlocked ? earned : 0 };
}

export function isSchoolBlocked(school?: { has_pending: boolean; validation: string } | null) {
  if (!school) return true;
  return school.has_pending || school.validation === "pendencia";
}

/** Whether a task template applies on a given date. */
export function taskAppliesOn(weekdays: string, dateStr: string) {
  const dow = new Date(dateStr + "T12:00:00Z").getUTCDay();
  if (weekdays === "weekdays") return dow >= 1 && dow <= 5;
  if (weekdays === "weekend") return dow === 0 || dow === 6;
  return true;
}

export const usernameToEmail = (u: string) =>
  `${u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "")}@gamedobiel.app`;
