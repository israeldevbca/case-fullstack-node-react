import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { buildProjection } from "./projection.engine";

const projectionInput = z.object({
  simulationId: z.string().cuid(),
  lifeStatus: z.enum(["ALIVE","DEAD","DISABLED"]).default("ALIVE")
});

const createSimInput = z.object({
  name: z.string().min(1),
  startDate: z.string().datetime(),
  realRate: z.number().min(0).default(0.04),
  isMain: z.boolean().default(false),
});

const routes: FastifyPluginAsync = async (app) => {
  app.post("/", async (req, reply) => {
    const data = createSimInput.parse(req.body);
    const sim = await app.prisma.simulation.create({ data });
    reply.code(201).send(sim);
  });

  app.get("/", async (req, reply) => {
    const sims = await app.prisma.simulation.findMany({
      orderBy: [{ name: "asc" }, { version: "desc" }]
    });
    reply.send(sims);
  });

  app.post("/duplicate/:id", async (req, reply) => {
    const id = (req.params as any).id as string;
    const target = await app.prisma.simulation.findUnique({ where: { id }, include: { allocations: { include: { records: true } }, movements: true, insurances: true } });
    if (!target) return reply.code(404).send({ message: "Not found" });
    const body = z.object({ name: z.string().min(1) }).parse(req.body);
    const dup = await app.prisma.$transaction(async (tx) => {
      const s = await tx.simulation.create({ data: { name: body.name, startDate: target.startDate, realRate: target.realRate, isMain: false } });
      for (const a of target.allocations) {
        const na = await tx.allocation.create({ data: { simulationId: s.id, type: a.type, name: a.name } });
        for (const r of a.records) await tx.allocationRecord.create({ data: { ...r, id: undefined, allocationId: na.id } as any });
      }
      for (const m of target.movements) await tx.movement.create({ data: { ...m, id: undefined, simulationId: s.id } as any });
      for (const ins of target.insurances) await tx.insurance.create({ data: { ...ins, id: undefined, simulationId: s.id } as any });
      return s;
    });
    reply.code(201).send(dup);
  });

  app.post("/projections", async (req, reply) => {
    const { simulationId, lifeStatus } = projectionInput.parse(req.body);
    const sim = await app.prisma.simulation.findUnique({
      where: { id: simulationId },
      include: {
        allocations: { include: { records: true } },
        movements: true,
        insurances: true
      }
    });
    if (!sim) return reply.code(404).send({ message: "Simulation not found" });

    // Consolidar valores iniciais (último record <= startDate) por tipo
    const sd = sim.startDate;
    let initialFinancial = 0, initialRealEstate = 0;
    for (const a of sim.allocations) {
      const recs = a.records.filter(r => r.date <= sd).sort((x,y)=> y.date.getTime()-x.date.getTime());
      const last = recs[0];
      if (last) {
        if (a.type === "FINANCIAL") initialFinancial += Number(last.value);
        else initialRealEstate += Number(last.value);
      }
    }

    // Agregar incomes/expenses por ano
    const yearlyIncome: Record<number, number> = {};
    const yearlyExpense: Record<number, number> = {};
    const pushYear = (obj: Record<number, number>, year: number, v: number) => obj[year] = (obj[year] ?? 0) + v;

    for (const m of sim.movements) {
      const startY = m.startDate.getFullYear();
      const endY = m.endDate ? m.endDate.getFullYear() : 2060;
      for (let y = startY; y <= endY; y++) {
        let amt = 0;
        if (m.frequency === "ONE_TIME" && y === startY) amt = Number(m.amount);
        if (m.frequency === "YEARLY") amt = Number(m.amount);
        if (m.frequency === "MONTHLY") amt = Number(m.amount) * 12;
        if (m.kind === "INCOME") pushYear(yearlyIncome, y, amt);
        else pushYear(yearlyExpense, y, amt);
      }
    }

    // Seguros
    const ins = sim.insurances.map(i => ({
      type: i.type,
      start: i.startDate,
      durationMonths: i.durationMonths,
      premiumMonth: Number(i.premiumMonth),
      insuredValue: Number(i.insuredValue)
    }));

    const points = buildProjection({
      startDate: sim.startDate,
      realRate: sim.realRate,
      lifeStatus,
      initialFinancial, initialRealEstate,
      yearlyIncome, yearlyExpense,
      insurances: ins
    });

    reply.send({ series: points });
  });
};

export default routes;
