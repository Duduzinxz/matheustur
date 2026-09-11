import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFrota } from "@/hooks/use-frota";
import { QuickActions } from "@/components/frota/QuickActions";
import { Section, StatCard, Vazio, btnPrimary } from "@/components/frota/ui";
import {
  brl,
  calcularOleo,
  gerarAlertas,
  km as fmtKm,
  mesAtual,
  mesLabel,
  num,
  previsaoMensal,
  resumoVeiculo,
  statusClass,
  statusLabel,
  ultimosMeses,
} from "@/lib/frota";

export const Route = createFileRoute("/_authenticated/frota/")({
  head: () => ({
    meta: [
      { title: "Dashboard da frota — Matheus Tur" },
      {
        name: "description",
        content: "Custos, receita e manutenções da frota da Matheus Tur.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FrotaDashboard,
});

function FrotaDashboard() {
  const { data, isLoading, error } = useFrota();

  if (isLoading) return <p className="mt-8 text-muted-foreground">Carregando frota...</p>;
  if (error || !data)
    return (
      <p className="mt-8 rounded-lg border border-destructive/40 bg-card p-4 text-sm text-muted-foreground">
        Não foi possível carregar a frota. Somente contas de administrador têm acesso.
      </p>
    );

  const mes = mesAtual();
  const ativos = data.veiculos.filter((v) => v.status === "ativo");
  const resumos = data.veiculos.map((v) => resumoVeiculo(data, v, mes));
  const totalDespesa = resumos.reduce((a, r) => a + r.despesaTotal, 0);
  const totalReceita = resumos.reduce((a, r) => a + r.receita, 0);
  const totalKm = resumos.reduce((a, r) => a + r.kmRodado, 0);
  const totalCombustivel = resumos.reduce((a, r) => a + r.combustivel, 0);
  const kmFrota = data.veiculos.reduce((a, v) => a + v.km_atual, 0);
  const alertas = gerarAlertas(data);
  const vencidas = alertas.filter((a) => a.nivel === "vencida");
  const proximas = alertas.filter((a) => a.nivel === "proxima");
  const previsao = previsaoMensal(data);

  const meses = ultimosMeses(6);
  const serieMeses = meses.map((m) => {
    const rs = data.veiculos.map((v) => resumoVeiculo(data, v, m));
    const despesa = rs.reduce((a, r) => a + r.despesaTotal, 0);
    const kmMes = rs.reduce((a, r) => a + r.kmRodado, 0);
    return {
      mes: mesLabel(m).slice(0, 3) + "/" + m.slice(2, 4),
      despesa: Number(despesa.toFixed(2)),
      receita: Number(rs.reduce((a, r) => a + r.receita, 0).toFixed(2)),
      combustivel: Number(rs.reduce((a, r) => a + r.combustivel, 0).toFixed(2)),
      manutencao: Number(rs.reduce((a, r) => a + r.manutencao, 0).toFixed(2)),
      km: kmMes,
      custoKm: kmMes > 0 ? Number((despesa / kmMes).toFixed(2)) : 0,
    };
  });

  const porVeiculo = resumos.map((r) => ({
    nome: r.veiculo.nome,
    despesa: Number(r.despesaTotal.toFixed(2)),
    receita: Number(r.receita.toFixed(2)),
    custoKm: r.custoPorKm ? Number(r.custoPorKm.toFixed(2)) : 0,
  }));

  if (data.veiculos.length === 0) {
    return (
      <Section
        title="Comece cadastrando um veículo"
        description="Depois de cadastrar o primeiro carro, você já pode registrar quilometragem, abastecimentos, manutenções e despesas."
      >
        <Link to="/frota/veiculos" className={btnPrimary}>
          + Cadastrar veículo
        </Link>
      </Section>
    );
  }

  return (
    <>
      <Section
        title="Lançamentos rápidos"
        description="Poucos cliques: escolha o veículo, informe o valor e salve."
      >
        <QuickActions veiculos={data.veiculos} />
      </Section>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Veículos ativos" value={String(ativos.length)} />
        <StatCard label="KM total da frota" value={fmtKm(kmFrota)} />
        <StatCard
          label={`Despesas ${mesLabel(mes)}`}
          value={brl(totalDespesa)}
          tone="red"
        />
        <StatCard label={`Receita ${mesLabel(mes)}`} value={brl(totalReceita)} tone="green" />
        <StatCard
          label="Resultado do mês"
          value={brl(totalReceita - totalDespesa)}
          tone={totalReceita - totalDespesa >= 0 ? "green" : "red"}
        />
        <StatCard
          label="Custo médio por KM"
          value={totalKm > 0 ? brl(totalDespesa / totalKm) : "—"}
          hint={totalKm > 0 ? `${fmtKm(totalKm)} rodados no mês` : "Registre a quilometragem"}
        />
        <StatCard label="Combustível no mês" value={brl(totalCombustivel)} />
        <StatCard
          label="Manutenções"
          value={`${vencidas.length} vencidas · ${proximas.length} próximas`}
          tone={vencidas.length ? "red" : proximas.length ? "yellow" : "green"}
        />
      </div>

      <Section
        title="Alertas"
        description="Gerados automaticamente a partir da quilometragem e das manutenções registradas."
      >
        {alertas.length === 0 ? (
          <Vazio>Nenhum alerta no momento. 🟢 Manutenções em dia.</Vazio>
        ) : (
          <ul className="space-y-2">
            {alertas.map((a, i) => (
              <li
                key={i}
                className={`rounded-lg border p-3 text-sm ${
                  a.nivel === "vencida"
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-yellow-500/50 bg-yellow-500/10"
                }`}
              >
                <p className="font-bold uppercase tracking-wide">
                  {a.nivel === "vencida" ? "🔴" : "🟡"} {a.titulo}
                </p>
                <p className="text-muted-foreground">{a.mensagem}</p>
                <Link
                  to="/frota/$veiculoId"
                  params={{ veiculoId: a.veiculoId }}
                  className="mt-1 inline-block text-xs font-bold uppercase text-tur-green hover:underline"
                >
                  Ver veículo
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Veículos" description="Clique em um veículo para ver a visão completa.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.veiculos.map((v) => {
            const r = resumos.find((x) => x.veiculo.id === v.id)!;
            const oleo = calcularOleo(v, data.manutencoes);
            return (
              <Link
                key={v.id}
                to="/frota/$veiculoId"
                params={{ veiculoId: v.id }}
                className="rounded-xl border border-border bg-background p-4 transition-colors hover:border-tur-green/60"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold uppercase">{v.nome}</p>
                  <span className="text-xs uppercase text-muted-foreground">{v.tipo}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {v.placa || "sem placa"} · {fmtKm(v.km_atual)}
                </p>
                <span
                  className={`mt-2 inline-block rounded border px-2 py-0.5 text-xs font-bold ${statusClass(oleo.status)}`}
                >
                  {statusLabel(oleo.status)}
                </span>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Despesas do mês</p>
                    <p className="font-bold">{brl(r.despesaTotal)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Receita do mês</p>
                    <p className="font-bold text-tur-green">{brl(r.receita)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title="Despesas e receita por mês" description="Últimos 6 meses.">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serieMeses}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                formatter={(v: number) => brl(v)}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="despesa" name="Despesas" fill="var(--destructive)" />
              <Bar dataKey="receita" name="Receita" fill="var(--tur-green)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Combustível e manutenção por mês">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serieMeses}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                formatter={(v: number) => brl(v)}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="combustivel" name="Combustível" fill="var(--tur-green)" />
              <Bar dataKey="manutencao" name="Manutenção" fill="var(--muted-foreground)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Despesas e receita por veículo" description={`Mês de ${mesLabel(mes)}.`}>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={porVeiculo}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="nome" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                formatter={(v: number) => brl(v)}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="despesa" name="Despesas" fill="var(--destructive)" />
              <Bar dataKey="receita" name="Receita" fill="var(--tur-green)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Custo por KM e quilometragem" description="Evolução dos últimos 6 meses.">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={serieMeses}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis yAxisId="l" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis
                yAxisId="r"
                orientation="right"
                stroke="var(--muted-foreground)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Line
                yAxisId="l"
                type="monotone"
                dataKey="custoKm"
                name="Custo por km (R$)"
                stroke="var(--tur-green)"
                strokeWidth={2}
              />
              <Line
                yAxisId="r"
                type="monotone"
                dataKey="km"
                name="KM rodados"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section
        title="Previsão de despesas"
        description="Estimativa baseada no histórico dos últimos meses. Não é um valor garantido."
      >
        <div className="rounded-lg border border-dashed border-yellow-500/50 bg-yellow-500/5 p-4">
          <p className="text-sm text-muted-foreground">
            Média das despesas dos últimos {previsao.meses || 0} meses com movimento:
          </p>
          <p className="mt-1 text-3xl font-bold text-yellow-500">
            ~{brl(previsao.media)} / mês
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            ⚠️ Estimativa calculada a partir do histórico registrado.
            {totalKm > 0 &&
              ` Considerando o custo atual de ${brl(totalDespesa / totalKm)} por km, cada 1.000 km rodados representam cerca de ${brl((totalDespesa / totalKm) * 1000)}.`}
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.veiculos.map((v) => {
            const p = previsaoMensal(data, v.id);
            return (
              <div key={v.id} className="rounded-lg border border-border p-3 text-sm">
                <p className="font-bold uppercase">{v.nome}</p>
                <p className="text-muted-foreground">
                  Previsão: <span className="font-bold text-yellow-500">~{brl(p.media)}</span> /
                  mês
                </p>
                <p className="text-xs text-muted-foreground">
                  Base: {p.meses} {p.meses === 1 ? "mês" : "meses"} de histórico
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Consumo médio da frota">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resumos.map((r) => (
            <div key={r.veiculo.id} className="rounded-lg border border-border p-3 text-sm">
              <p className="font-bold uppercase">{r.veiculo.nome}</p>
              <p className="text-muted-foreground">
                Consumo no mês:{" "}
                <span className="font-bold text-foreground">
                  {r.consumoMedio ? `${num(r.consumoMedio)} km/l` : "—"}
                </span>
              </p>
              <p className="text-muted-foreground">
                Litros: <span className="font-bold text-foreground">{num(r.litros)} L</span>
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
