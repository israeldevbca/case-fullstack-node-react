"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";

/* ----------------------------- Tipos e mocks ------------------------------ */
type Point = { year: number; total: number; financial: number; realEstate: number };

const chartData: Point[] = [
  { year: 2025, total: 2_685_000, financial: 1_905_000, realEstate: 380_000 },
  { year: 2026, total: 2_800_000, financial: 2_020_000, realEstate: 380_000 },
  { year: 2027, total: 2_960_000, financial: 2_180_000, realEstate: 380_000 },
  { year: 2028, total: 3_080_000, financial: 2_300_000, realEstate: 380_000 },
  { year: 2029, total: 3_180_000, financial: 2_400_000, realEstate: 380_000 },
  { year: 2030, total: 3_270_000, financial: 2_490_000, realEstate: 380_000 },
  { year: 2031, total: 3_320_000, financial: 2_540_000, realEstate: 380_000 },
  { year: 2032, total: 3_360_000, financial: 2_580_000, realEstate: 380_000 },
  { year: 2033, total: 3_380_000, financial: 2_600_000, realEstate: 380_000 },
  { year: 2034, total: 3_340_000, financial: 2_560_000, realEstate: 380_000 },
  { year: 2035, total: 3_260_000, financial: 2_480_000, realEstate: 380_000 },
];

/* -------------------------------- Helpers -------------------------------- */
const currency = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function abreviaBRL(v: number) {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return `R$ ${(v / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return `R$ ${v}`;
}
function legenda(key: string) {
  switch (key) {
    case "total":
      return "Total";
    case "financial":
      return "Financeiro";
    case "realEstate":
      return "Imóvel";
    default:
      return key;
  }
}

/* --------------------------------- Página --------------------------------- */
export default function PlannerScreen() {
  return (
    <main className="min-h-screen bg-[#0b0d12] text-slate-200">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6">
        {/* TOP BAR */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-center gap-3">
            <select
              aria-label="Selecionar cliente"
              className="rounded-2xl border border-slate-800 bg-[#0f1220] px-3 py-2 text-sm outline-none shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]"
              defaultValue="Matheus Silveira"
            >
              <option>Matheus Silveira</option>
            </select>
            <div className="rounded-2xl border border-slate-800 bg-[#0f1220] px-4 py-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Patrimônio Líquido Total
              </p>
              <p className="text-xl font-semibold leading-5">R$ 2.679.930</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <MiniCard title="R$ 2.679.930" subtitle="" percent={0.6} />
            <MiniCard title="R$ 3.373.960" subtitle="+26,3%" percent={0.85} gradient="indigo" />
            <MiniCard title="R$ 2.173.250" subtitle="" percent={0.42} gradient="slate" />
          </div>
        </div>

        {/* SWITCHES */}
        <div className="mb-3 flex items-center gap-2 text-sm">
          <Chip active>Vivo</Chip>
          <Chip>Morto</Chip>
          <Chip>Inválido</Chip>
        </div>

        {/* CHART CARD */}
        <section className="rounded-3xl border border-slate-800 bg-[#0f1220] shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
            <p className="text-[13px] font-medium text-slate-200">Projeção Patrimonial</p>
            <div className="flex gap-2 text-[12px] text-slate-300">
              <Pill>Ver com detalhes</Pill>
              <Pill>Ver como Tabela</Pill>
            </div>
          </div>

          {/* legenda inline, como no mock */}
          <div className="px-5 pt-3">
            <LegendInline />
          </div>

          <div className="h-[380px] w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 4 }}>
                <CartesianGrid stroke="#1d2535" strokeDasharray="4 6" />
                <XAxis dataKey="year" stroke="#94a3b8" tickMargin={8} />
                <YAxis stroke="#94a3b8" tickFormatter={abreviaBRL} width={80} />
                <Tooltip
                  contentStyle={{
                    background: "#0b0e1a",
                    border: "1px solid #1f2937",
                    borderRadius: 12,
                    color: "#e5e7eb",
                  }}
                  formatter={(val: any, name: any) => [currency(Number(val)), legenda(name)]}
                  labelFormatter={(l) => `Ano: ${l}`}
                />
                {/* linha de referência no zero */}
                <ReferenceLine y={0} stroke="#f59e0b" strokeDasharray="6 6" />

                {/* Total (verde, mais forte) */}
                <Line type="monotone" dataKey="total" name="Total" stroke="#22c55e" strokeWidth={3} dot={false} />
                {/* Financeiro (roxo) */}
                <Line type="monotone" dataKey="financial" name="Financeiro" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                {/* Imóvel (amarelo tracejado) */}
                <Line
                  type="monotone"
                  dataKey="realEstate"
                  name="Imóvel"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="6 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* TIMELINE */}
        <section className="mt-5 rounded-3xl border border-slate-800 bg-[#0f1220] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-medium text-slate-200">Timeline</p>
            <div className="flex gap-2">
              <Pill active>Financeiras</Pill>
              <Pill>Imobilizadas</Pill>
            </div>
          </div>
          <Timeline />
        </section>

        {/* MOVIMENTAÇÕES */}
        <h3 className="mt-8 mb-3 text-sm text-slate-300">Movimentações</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <MovementCard
            title="Herança"
            date="09/07/23 – 22/07/23"
            freq="Recebimento Único"
            category="Crédito"
            value="+ R$ 220.000"
            up
          />
          <MovementCard
            title="Custo do filho"
            date="09/07/23 – 29/07/23"
            freq="Pagamento Mensal"
            category="Despesas"
            value="– R$ 1.500"
          />
          <MovementCard
            title="Comissão"
            date="09/07/22 – 22/07/23"
            freq="Recebimento Anual"
            category="Crédito"
            value="+ R$ 500.000"
            up
          />
        </div>

        {/* SEGUROS */}
        <h3 className="mt-8 mb-3 text-sm text-slate-300">Seguros</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <InsuranceCard
            title="Seguro de Vida Familiar"
            type="Seguro de Vida"
            duracao="96 meses"
            premio="R$ 120/mês"
            total="R$ 500.000"
          />
          <InsuranceCard
            title="Seguro de Invalidez"
            type="Seguro de Invalidez"
            duracao="96 meses"
            premio="R$ 300/mês"
            total="R$ 100.000"
          />
        </div>
      </div>
    </main>
  );
}

/* ---------------------------- Componentes UI ------------------------------ */

function MiniCard({
  title,
  subtitle,
  percent,
  gradient = "cyan",
}: {
  title: string;
  subtitle?: string;
  percent: number; // 0..1
  gradient?: "cyan" | "indigo" | "slate";
}) {
  const p = Math.max(0, Math.min(1, percent)) * 100;
  const grad =
    gradient === "indigo"
      ? "from-indigo-400 to-violet-500"
      : gradient === "slate"
      ? "from-slate-500 to-slate-300"
      : "from-cyan-400 to-blue-500";
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0f1220] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]">
      <div className="mb-2 h-2 w-full rounded-md bg-slate-800/60">
        <div className={`h-2 rounded-md bg-gradient-to-r ${grad}`} style={{ width: `${p}%` }} />
      </div>
      {subtitle ? <p className="text-[11px] text-slate-400">{subtitle}</p> : <div className="h-[14px]" />}
      <p className="text-sm font-semibold">{title}</p>
    </div>
  );
}

function Chip({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      className={`rounded-full px-3 py-1 text-[12px] ${
        active
          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
          : "bg-transparent text-slate-300 border border-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function Pill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[12px] ${
        active ? "border-cyan-600 text-cyan-300" : "border-slate-700 text-slate-300"
      }`}
    >
      {children}
    </span>
  );
}

function LegendInline() {
  const items = [
    { label: "Financeiro", color: "#8b5cf6" },
    { label: "Imóvel", color: "#f59e0b" },
    { label: "Total", color: "#22c55e" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-5 text-[12px] text-slate-300">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: i.color }} />
          <span>{i.label}</span>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  const years = ["2025", "2030", "2035", "2040", "2045", "2050", "2055", "2060", "2065"];
  const dots = ["12%", "34%", "56%", "74%"]; // posições de exemplo
  return (
    <div className="relative h-24">
      <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-slate-700/60" />
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
        <div className="grid grid-cols-9 text-center text-xs text-slate-400">
          {years.map((y) => (
            <div key={y} className="relative">
              <div className="mx-auto h-2 w-[2px] bg-slate-600" />
              <span className="absolute left-1/2 top-3 -translate-x-1/2">{y}</span>
            </div>
          ))}
        </div>
      </div>
      {dots.map((left, i) => (
        <div
          key={i}
          className="absolute top-[34%] h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-rose-400"
          style={{ left }}
        />
      ))}
    </div>
  );
}

function MovementCard({
  title,
  date,
  freq,
  category,
  value,
  up,
}: {
  title: string;
  date: string;
  freq: string;
  category: string;
  value: string;
  up?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0f1220] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 text-xs text-slate-400">
        <p>{date}</p>
        <p>{freq}</p>
        <p>{category}</p>
      </div>
      <div className="mt-3 text-right text-sm font-semibold">
        <span className={up ? "text-emerald-400" : "text-rose-400"}>{value}</span>
      </div>
    </div>
  );
}

function InsuranceCard({
  title,
  type,
  duracao,
  premio,
  total,
}: {
  title: string;
  type: string;
  duracao: string;
  premio: string;
  total: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0f1220] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)]">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 text-xs text-slate-400">
        <p>{type}</p>
        <p>Duração: {duracao}</p>
        <p>Prêmio: {premio}</p>
      </div>
      <div className="mt-3 text-right text-sm font-semibold text-fuchsia-400">{total}</div>
    </div>
  );
}
