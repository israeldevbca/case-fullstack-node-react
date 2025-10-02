import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Simulação principal
  const sim = await prisma.simulation.create({
    data: {
      name: "Plano Original",
      // adicione 'version' se o seu schema exigir:
      version: 1,
      // mantenha estes se EXISTIREM no seu schema; se não existir, remova:
      isMain: true,
      startDate: new Date("2025-01-01"),
      realRate: 0.04,
    } as any, // 'as any' evita erro caso algum campo não exista no seu schema
  });

  // Alocações
  const fin = await prisma.allocation.create({
    data: { simulationId: sim.id, type: Prisma.AllocationType.FINANCIAL, name: "Reserva" },
  });

  const imob = await prisma.allocation.create({
    data: { simulationId: sim.id, type: Prisma.AllocationType.REAL_ESTATE, name: "Apartamento" },
  });

  // Registros de alocação
  await prisma.allocationRecord.createMany({
    data: [
      { allocationId: fin.id, date: new Date("2024-12-01"), value: 150000 },
      {
        allocationId: imob.id,
        date: new Date("2024-11-01"),
        value: 380000,
        hasLoan: true,
        loanStart: new Date("2023-01-01"),
        loanInstallments: 240,
        loanRate: 0.10,
        downPayment: 50000,
      } as any, // caso seu schema não tenha todos esses campos, remova os que faltarem
    ],
  });

  // Movimentações
  await prisma.movement.createMany({
    data: [
      {
        simulationId: sim.id,
        kind: Prisma.MovementKind.INCOME,
        name: "Salário",
        amount: 15000,
        frequency: Prisma.Frequency.MONTHLY,
        startDate: new Date("2025-01-01"),
      },
      {
        simulationId: sim.id,
        kind: Prisma.MovementKind.EXPENSE,
        name: "Custo do filho",
        amount: 1500,
        frequency: Prisma.Frequency.MONTHLY,
        startDate: new Date("2025-01-01"),
      },
      {
        simulationId: sim.id,
        // ATENÇÃO: confira qual é o nome no seu enum (INHERITANCE? HERITAGE?)
        kind: (Prisma.MovementKind as any).INHERITANCE ?? Prisma.MovementKind.INCOME, // fallback só pra não quebrar
        name: "Herança",
        amount: 220000,
        frequency: Prisma.Frequency.ONE_TIME,
        startDate: new Date("2027-07-22"),
      },
    ],
  });

  // Seguros
  await prisma.insurance.createMany({
    data: [
      {
        simulationId: sim.id,
        name: "Seguro de Vida Familiar",
        type: Prisma.InsuranceType.LIFE,
        startDate: new Date("2025-01-01"),
        durationMonths: 96,
        premiumMonth: 120,
        insuredValue: 500000,
      },
      {
        simulationId: sim.id,
        name: "Seguro de Invalidez",
        type: Prisma.InsuranceType.DISABILITY,
        startDate: new Date("2025-01-01"),
        durationMonths: 96,
        premiumMonth: 300,
        insuredValue: 100000,
      },
    ],
  });

  console.log("✅ Seed concluído.");
}

main()
  .catch((e) => (console.error(e), process.exit(1)))
  .finally(() => prisma.$disconnect());
