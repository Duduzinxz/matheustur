import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useFrota } from "@/hooks/use-frota";
import { Section, StatCard, Vazio, inputCls } from "@/components/frota/ui";
import {
  brl,
  km as fmtKm,
  mesAtual,
  mesLabel,
  num,
  previsaoMensal,
  resumoVeiculo,
  ultimosMeses,
} from "@/lib/frota";

export const Route = createFileRoute("/_authenticated/frota/fechamento")({
  head: () => ({
    meta: [
      { title: "Fechamento mensal da frota — Matheus Tur" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FechamentoPage,
});

function FechamentoPage() {
  const { data, isLoading, error } = useFrota();
  const [mes, setMes] = useState(mesAtual());

  if (isLoading) return <p className="mt-8 text-muted-foreground">Carregando...</p>;
  if (error || !data)
    return (
      <p className="mt-8 rounded-lg border border-destructive/40 bg-card p-4 text-sm text-muted-foreground">
        Não foi possível carregar o fechamento. Somente contas de administrador têm acesso.
      </p>
    );

  const resumos = data.veiculos.map((v) => resumoVeiculo(data, v, mes));
  const despesa = resumos.reduce((a, r) => a + r.despesaTotal, 0);
  const receita = resumos.reduce((a, r) => a + r.receita, 0);
  const kmTotal = resumos.reduce((a, r) => a + r.kmRodado, 0);
  const previsao = previsaoMensal(data);
  const meses = ultimosMeses(18);

  return (
    <>
      <Section
        title="Fechamento mensal"
        description="Escolha o mês para ver as despesas, a receita e o resultado de cada veículo."
        action={
          <div className="w-48">
            <select
              aria-label="Mês do fechamento"
              className={inputCls}
              value={mes}
              onChange={(e) => setMes(e.target.value)}
            >
              {meses
                .slice()
                .reverse()
                .map((m) => (
                  <option key={m} value={m}>
                    {mesLabel(m)}
                  </option>
                ))}
            </select>
          </div>
        }
      >
        {data.veiculos.length === 0 ? (
          <Vazio>Cadastre um veículo para começar o fechamento.</Vazio>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {resumos.map((r) => (
              <div key={r.veiculo.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold uppercase">{r.veiculo.nome}</h3>
                  <span className="text-xs uppercase text-muted-foreground">
                    {fmtKm(r.kmRodado)} no mês
                  </span>
                </div>
                <dl className="mt-3 space-y-1 text-sm">
                  {[
                    ["Combustível", r.combustivel],
                    ["Manutenção", r.manutencao],
                    ["Pneus", r.pneus],
                    ["Outras despesas", r.outras],
                  ].map(([label, valor]) => (
                    <div key={label as string} className="flex justify-between">
                      <dt className="text-muted-foreground">{label as string}</dt>
                      <dd>{brl(valor as number)}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-border pt-1 font-bold">
                    <dt>Despesa total</dt>
                    <dd className="text-destructive">{brl(r.despesaTotal)}</dd>
                  </div>
                  <div className="flex justify-between font-bold">
                    <dt>Receita gerada</dt>
                    <dd className="text-tur-green">{brl(r.receita)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 text-base font-bold">
                    <dt>Resultado</dt>
                    <dd className={r.resultado >= 0 ? "text-tur-green" : "text-destructive"}>
                      {brl(r.resultado)}
                    </dd>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <dt>Custo por km</dt>
                    <dd>{r.custoPorKm ? brl(r.custoPorKm) : "—"}</dd>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <dt>Consumo médio</dt>
                    <dd>{r.consumoMedio ? `${num(r.consumoMedio)} km/l` : "—"}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={`Total da frota — ${mesLabel(mes)}`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Despesas totais" value={brl(despesa)} tone="red" />
          <StatCard label="Receita total" value={brl(receita)} tone="green" />
          <StatCard
            label="Resultado total"
            value={brl(receita - despesa)}
            tone={receita - despesa >= 0 ? "green" : "red"}
          />
          <StatCard label="KM total rodado" value={fmtKm(kmTotal)} />
          <StatCard
            label="Custo médio por KM"
            value={kmTotal > 0 ? brl(despesa / kmTotal) : "—"}
          />
        </div>
      </Section>

      <Section
        title="Previsão para os próximos meses"
        description="Estimativa baseada na média do histórico — não é um valor garantido."
      >
        <div className="rounded-lg border border-dashed border-yellow-500/50 bg-yellow-500/5 p-4">
          <p className="text-3xl font-bold text-yellow-500">~{brl(previsao.media)} / mês</p>
          <p className="mt-1 text-xs text-muted-foreground">
            ⚠️ Média das despesas da frota nos últimos {previsao.meses} meses com movimento.
          </p>
        </div>
      </Section>
    </>
  );
}
