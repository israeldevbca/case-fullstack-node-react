import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const base = z.object({
  simulationId: z.string().cuid(),
  kind: z.enum(["INCOME","EXPENSE"]),
  name: z.string().min(1),
  amount: z.number(),
  frequency: z.enum(["ONE_TIME","MONTHLY","YEARLY"]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional()
});

const routes: FastifyPluginAsync = async (app) => {
  app.post("/", async (req, reply) => {
    const d = base.parse(req.body);
    const created = await app.prisma.movement.create({ data: { ...d, startDate: new Date(d.startDate), endDate: d.endDate ? new Date(d.endDate) : null } as any });
    reply.code(201).send(created);
  });

  app.get("/by-simulation/:id", async (req, reply) => {
    const id = (req.params as any).id;
    const items = await app.prisma.movement.findMany({ where: { simulationId: id } });
    reply.send(items);
  });
};

export default routes;
