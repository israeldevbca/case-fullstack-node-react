import cors from "@fastify/cors";
import Fastify from "fastify";
import swagger from "./plugins/swagger";
import prismaPlugin from "./plugins/prisma";
import simulationRoutes from "./modules/simulations/simulation.routes";
import allocationRoutes from "./modules/allocations/allocation.routes";
import movementRoutes from "./modules/movements/movement.routes";
import insuranceRoutes from "./modules/insurances/insurance.routes";

export async function buildApp() {
  const app = Fastify({ logger: true });

  
  await app.register(cors, {
    origin: "*", // ou ["http://localhost:3000"]
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  await app.register(swagger);
  await app.register(prismaPlugin);

  app.register(simulationRoutes, { prefix: "/simulations" });
  app.register(allocationRoutes, { prefix: "/allocations" });
  app.register(movementRoutes, { prefix: "/movements" });
  app.register(insuranceRoutes, { prefix: "/insurances" });

  app.get("/health", async () => ({ ok: true }));

  return app;
}
