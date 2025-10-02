// src/modules/allocations/allocation.routes.ts
import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { PrismaClient, AllocationType } from "@prisma/client";

const prisma = new PrismaClient();

const allocationRoutes: FastifyPluginAsync = async (app) => {
  // POST /allocations
  app.post("/allocations", {
    schema: {
      summary: "Create allocation",
      body: {
        type: "object",
        required: ["simulationId", "type", "name"],
        properties: {
          simulationId: { type: "string" },
          type: { type: "string", enum: ["FINANCIAL","REAL_ESTATE"] },
          name: { type: "string" }
        }
      },
      response: {
        201: {
          type: "object",
          properties: { id: { type: "string" }, type: { type: "string" }, name: { type: "string" } }
        }
      }
    }
  }, async (req, reply) => {
    const body = z.object({
      simulationId: z.string().cuid(),
      type: z.nativeEnum(AllocationType),
      name: z.string().min(2)
    }).parse(req.body);

    // garante que a sim existe
    const sim = await prisma.simulation.findUnique({ where: { id: body.simulationId } });
    if (!sim) return reply.code(404).send({ message: "Simulation not found" });

    // 👇 PRISMA: conecta a relação obrigatória
    const created = await prisma.allocation.create({
      data: {
        type: body.type,
        name: body.name,
        simulation: { connect: { id: body.simulationId } }  // <- aqui
      }
    });

    return reply.code(201).send(created);
  });

  app.get("/allocations/:id", async (req, reply) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const item = await prisma.allocation.findUnique({ where: { id } });
    if (!item) return reply.code(404).send({ message: "Not found" });
    return item;
  });

  app.post("/allocations/:id/record", {
    schema: {
      summary: "Add allocation record",
      params: { type: "object", required: ["id"], properties: { id: { type: "string" } } },
      body: {
        type: "object",
        required: ["date","value"],
        properties: { date: { type: "string", format: "date" }, value: { type: "number" } }
      }
    }
  }, async (req, reply) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({ date: z.string().date(), value: z.number() }).parse(req.body);

    const alloc = await prisma.allocation.findUnique({ where: { id } });
    if (!alloc) return reply.code(404).send({ message: "Allocation not found" });

    const created = await prisma.allocationRecord.create({
      data: { allocationId: id, date: new Date(body.date), value: body.value }
    });
    return reply.code(201).send(created);
  });
};

export default allocationRoutes;
