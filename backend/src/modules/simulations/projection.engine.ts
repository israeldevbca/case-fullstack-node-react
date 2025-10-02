export type ProjectionPoint = {
  year: number;
  financial: number;
  realEstate: number;
  total: number;
  totalWithoutInsurances: number;
};

export function buildProjection(params: {
  startDate: Date;
  realRate: number;
  lifeStatus: "ALIVE"|"DEAD"|"DISABLED";
  initialFinancial: number;
  initialRealEstate: number;
  yearlyIncome: Record<number, number>;
  yearlyExpense: Record<number, number>;
  insurances: Array<{
    type: "LIFE" | "DISABILITY";
    start: Date;
    durationMonths: number;
    premiumMonth: number;
    insuredValue: number;
  }>;
}): ProjectionPoint[] {
  const horizon = 2060;
  const startYear = params.startDate.getFullYear();
  const points: ProjectionPoint[] = [];

  let fin = params.initialFinancial;
  let imm = params.initialRealEstate;

  const monthlyToYear = (v: number) => v * 12;

  for (let year = startYear; year <= horizon; year++) {
    const rawIn = params.yearlyIncome[year] ?? 0;
    const rawOut = params.yearlyExpense[year] ?? 0;

    const incomes = (params.lifeStatus === "ALIVE" ? rawIn : 0);
    const expenses = (params.lifeStatus === "DEAD" ? rawOut/2 : rawOut) * -1;

    const premiums = params.insurances.reduce((acc, s) => {
      const y0 = s.start.getFullYear();
      const end = new Date(s.start); end.setMonth(end.getMonth()+s.durationMonths);
      const active = year >= y0 && year <= end.getFullYear();
      return acc + (active ? monthlyToYear(s.premiumMonth) : 0);
    }, 0) * -1;

    const benefit = params.insurances.reduce((acc, s) => {
      const y0 = s.start.getFullYear();
      return acc + (year === y0 ? Number(s.insuredValue) : 0);
    }, 0);

    fin += incomes + expenses + premiums + benefit;
    fin *= (1 + params.realRate);

    const total = fin + imm;
    const totalWithoutIns = total - benefit;

    points.push({
      year,
      financial: Math.max(Number(fin),0),
      realEstate: Math.max(Number(imm),0),
      total: Math.max(Number(total),0),
      totalWithoutInsurances: Math.max(Number(totalWithoutIns),0),
    });
  }
  return points;
}
