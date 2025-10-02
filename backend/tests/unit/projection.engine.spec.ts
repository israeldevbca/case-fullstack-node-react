import { buildProjection } from "../../src/modules/simulations/projection.engine";

describe("projection engine", () => {
  it("aplica taxa real e regras de status DEAD (metade da despesa)", () => {
    const series = buildProjection({
      startDate: new Date("2025-01-01"),
      realRate: 0.04,
      lifeStatus: "DEAD",
      initialFinancial: 100000,
      initialRealEstate: 200000,
      yearlyIncome: { 2025: 60000 },
      yearlyExpense: { 2025: 24000 },
      insurances: [{
        type: "LIFE",
        start: new Date("2025-01-01"),
        durationMonths: 12,
        premiumMonth: 200,
        insuredValue: 100000
      }]
    });

    const y2025 = series.find(p => p.year === 2025)!;
    expect(y2025.total).toBeGreaterThan(380000);
  });
});
