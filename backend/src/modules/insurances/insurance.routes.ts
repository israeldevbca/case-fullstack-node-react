import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const base = z.object({
  simulationId: z.string().cuid(),
  name: z.string().min(1),
  type: z.enum(["LIFE","DISABILITY"]),
  startDate: z.string().datetime(),
  durationMonths: z.number().int().positive(),
  premiumMonth: z.number().nonnegative(),
  insuredValue: z.number().nonnegative()
});

const routes: FastifyPluginAsync = async (app) => {
  app.post("/", async (req, reply) => {
    const d = base.parse(req.body);
    const created = await app.prisma.insurance.create({ data: { ...d, startDate: new Date(d.startDate) } as any });
    reply.code(201).send(created);
  });

  app.get("/by-simulation/:id", async (req, reply) => {
    const id = (req.params as any).id;
    const items = await app.prisma.insurance.findMany({ where: { simulationId: id } });
    reply.send(items);
  });
};

export default routes;
