import { describe, it, expect } from "vitest";
import { computeMinutes, isSchoolBlocked, taskAppliesOn } from "@/lib/autonomy";

describe("tempo de telas", () => {
  it("60 min garantidos sem extras", () => {
    expect(computeMinutes({ base: 60, maxExtra: 120, approved: [], pending: [], used: [], schoolBlocked: false }).available).toBe(60);
  });
  it("extras limitados a 120 por dia", () => {
    const r = computeMinutes({ base: 60, maxExtra: 120, approved: [50, 50, 50], pending: [], used: [], schoolBlocked: false });
    expect(r.earned).toBe(120);
    expect(r.available).toBe(180);
  });
  it("pendência escolar segura os extras", () => {
    const r = computeMinutes({ base: 60, maxExtra: 120, approved: [20], pending: [10], used: [], schoolBlocked: true });
    expect(r.available).toBe(60);
    expect(r.blockedExtra).toBe(20);
    expect(r.waiting).toBe(10);
  });
  it("minutos usados são descontados", () => {
    expect(computeMinutes({ base: 60, maxExtra: 120, approved: [15], pending: [], used: [30], schoolBlocked: false }).available).toBe(45);
  });
  it("sem registro escolar = bloqueado", () => {
    expect(isSchoolBlocked(null)).toBe(true);
    expect(isSchoolBlocked({ has_pending: false, validation: "aguardando" })).toBe(false);
  });
  it("fim de semana só sáb/dom", () => {
    expect(taskAppliesOn("weekend", "2026-11-07")).toBe(true);
    expect(taskAppliesOn("weekend", "2026-11-05")).toBe(false);
  });
});
