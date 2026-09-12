import { createFileRoute, Link } from "@tanstack/react-router";
import { useFrota } from "@/hooks/use-frota";
import { QuickActions } from "@/components/frota/QuickActions";
import { Section, StatCard, Td, Th, TableWrap, Vazio } from "@/components/frota/ui";
import {
  brl,
  calcularOleo,
  custoPorKmPneu,
  dataBR,
  km as fmtKm,
  mesAtual,
  mesLabel,
  num,
  previsaoMensal,
  resumoVeiculo,
  statusClass,
  statusLabel,
  vidaUtilPneu,
} from "@/lib/frota";

export const Route = createFileRoute("/_authenticated/frota/$veiculoId")({
  head: () => ({
    meta: [
      { title: "Veículo — Matheus Tur" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VeiculoPage,
});

function VeiculoPage() {
  const { veiculoId } = Route.useParams();
  const { data, isLoading, error } = useFrota();

  if (isLoading) return <p className="mt-8 text-muted-foreground">Carregando...</p>;
  if (error || !data)
    return (
      <p className="mt-8 rounded-lg border border-destructive/40 bg-card p-4 text-sm text-muted-foreground">
        Não foi possível carregar o veículo. Somente contas de administrador têm acesso.
      </p>
    );

  const veiculo = data.veiculos.find((v) => v.id === veiculoId);
  if (!veiculo)
    return (
      <Section title="Veículo não encontrado">
        <Link to="/frota/veiculos" className="text-tur-green hover:underline">
          Voltar para a lista de veículos
        </Link>
      </Section>
    );

  const mes = mesAtual();
  const doMes = resumoVeiculo(data, veiculo, mes);
  const total = resumoVeiculo(data, veiculo, null);
  const oleo = calcularOleo(veiculo, data.manutencoes);
  const previsao = previsaoMensal(data, veiculo.id);

  const manutencoes = data.manutencoes.filter((m) => m.veiculo_id === veiculo.id);
  const pneus = data.pneus.filter((p) => p.veiculo_id === veiculo.id);
  const pneusAtuais = pneus.filter((p) => p.km_retirada == null);
  const pneusTrocados = pneus.filter((p) => p.km_retirada != null);
  const vidaMedia =
    pneusTrocados.length > 0
      ? pneusTrocados.reduce((a, p) => a + (vidaUtilPneu(p, veiculo) ?? 0), 0) /
        pneusTrocados.length
      : null;
  const abastecimentos = data.abastecimentos.filter((a) => a.veiculo_id === veiculo.id);
  const servicos = data.servicos.filter((s) => s.veiculo_id === veiculo.id);
  const kmRegistros = data.kmRegistros.filter((k) => k.veiculo_id === veiculo.id);
  const proximas = manutencoes.filter((m) => m.proximo_km != null || m.proxima_data != null);

  return (
    <>
      <Section
        title={veiculo.nome}
        description={`${[veiculo.marca, veiculo.modelo].filter(Boolean).join(" ") || veiculo.tipo}${
          veiculo.ano ? ` · ${veiculo.ano}` : ""
        } · ${veiculo.placa || "sem placa"}`}
        action={
          <span
            className={`rounded border px-2 py-1 text-xs font-bold uppercase ${
              veiculo.status === "ativo"
                ? "border-tur-green/60 text-tur-green"
                : "border-border text-muted-foreground"
            }`}
          >
            {veiculo.status}
          </span>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="KM atual" value={fmtKm(veiculo.km_atual)} />
          <StatCard label={`Despesas ${mesLabel(mes)}`} value={brl(doMes.despesaTotal)} tone="red" />
          <StatCard label="Despesas acumuladas" value={brl(total.despesaTotal)} />
          <StatCard label="Receita do mês" value={brl(doMes.receita)} tone="green" />
          <StatCard
            label="Resultado do mês"
            value={brl(doMes.resultado)}
            tone={doMes.resultado >= 0 ? "green" : "red"}
          />
          <StatCard
            label="Resultado acumulado"
            value={brl(total.resultado)}
            tone={total.resultado >= 0 ? "green" : "red"}
          />
          <StatCard
            label="Custo por KM (mês)"
            value={doMes.custoPorKm ? brl(doMes.custoPorKm) : "—"}
          />
          <StatCard
            label="Previsão mensal"
            value={`~${brl(previsao.media)}`}
            hint="Estimativa pelo histórico"
            tone="yellow"
          />
        </div>
        <div className="mt-4">
          <QuickActions veiculos={[veiculo]} veiculoFixo={veiculo.id} />
        </div>
      </Section>

      <Section title="Manutenção programada">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Última troca de óleo" value={dataBR(oleo.ultimaData)} />
          <StatCard
            label="KM da última troca"
            value={oleo.ultimaKm != null ? fmtKm(oleo.ultimaKm) : "—"}
          />
          <StatCard
            label="Próxima troca"
            value={oleo.proximaKm != null ? fmtKm(oleo.proximaKm) : "—"}
            hint={`Intervalo: ${fmtKm(veiculo.intervalo_oleo_km)}`}
          />
          <StatCard
            label="Faltam"
            value={oleo.restante != null ? fmtKm(Math.max(oleo.restante, 0)) : "—"}
            tone={
              oleo.status === "vencida" ? "red" : oleo.status === "proxima" ? "yellow" : "green"
            }
          />
        </div>
        <span
          className={`mt-3 inline-block rounded border px-2 py-1 text-xs font-bold ${statusClass(oleo.status)}`}
        >
          {statusLabel(oleo.status)}
        </span>

        <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Próximas manutenções
        </h3>
        {proximas.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Nenhuma manutenção programada registrada.
          </p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {proximas.map((m) => (
              <li key={m.id} className="text-muted-foreground">
                <span className="font-bold uppercase text-foreground">{m.tipo}</span>
                {m.proximo_km ? ` — ${fmtKm(m.proximo_km)}` : ""}
                {m.proxima_data ? ` — ${dataBR(m.proxima_data)}` : ""}
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Histórico de manutenção
        </h3>
        <div className="mt-2">
          {manutencoes.length === 0 ? (
            <Vazio>Nenhuma manutenção registrada.</Vazio>
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Data</Th>
                  <Th>KM</Th>
                  <Th>Tipo</Th>
                  <Th>Descrição</Th>
                  <Th>Oficina</Th>
                  <Th>Valor</Th>
                </tr>
              </thead>
              <tbody>
                {manutencoes.map((m) => (
                  <tr key={m.id}>
                    <Td>{dataBR(m.data)}</Td>
                    <Td>{m.km ? fmtKm(m.km) : "—"}</Td>
                    <Td className="uppercase">{m.tipo}</Td>
                    <Td>{m.descricao || "—"}</Td>
                    <Td>{m.fornecedor || "—"}</Td>
                    <Td className="font-bold">{brl(Number(m.valor))}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>
      </Section>

      <Section
        title="Pneus"
        description={
          vidaMedia
            ? `Vida útil média dos pneus já substituídos: ${fmtKm(vidaMedia)}.`
            : "Registre as retiradas para calcular a vida útil média."
        }
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Pneus atuais
        </h3>
        <div className="mt-2">
          {pneusAtuais.length === 0 ? (
            <Vazio>Nenhum pneu em uso registrado.</Vazio>
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Posição</Th>
                  <Th>Marca / modelo</Th>
                  <Th>Instalado em</Th>
                  <Th>KM instalação</Th>
                  <Th>Rodou até agora</Th>
                  <Th>Custo/km</Th>
                </tr>
              </thead>
              <tbody>
                {pneusAtuais.map((p) => (
                  <tr key={p.id}>
                    <Td>{p.posicao}</Td>
                    <Td>{[p.marca, p.modelo].filter(Boolean).join(" ") || "—"}</Td>
                    <Td>{dataBR(p.data_instalacao)}</Td>
                    <Td>{fmtKm(p.km_instalacao)}</Td>
                    <Td className="font-bold text-tur-green">
                      {fmtKm(vidaUtilPneu(p, veiculo) ?? 0)}
                    </Td>
                    <Td>
                      {custoPorKmPneu(p, veiculo) != null
                        ? `${brl(custoPorKmPneu(p, veiculo)!)}/km`
                        : "—"}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>

        <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Histórico de pneus substituídos
        </h3>
        <div className="mt-2">
          {pneusTrocados.length === 0 ? (
            <Vazio>Nenhuma substituição registrada ainda.</Vazio>
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Posição</Th>
                  <Th>Marca</Th>
                  <Th>KM instalação</Th>
                  <Th>KM retirada</Th>
                  <Th>Vida útil</Th>
                  <Th>Custo/km</Th>
                </tr>
              </thead>
              <tbody>
                {pneusTrocados.map((p) => (
                  <tr key={p.id}>
                    <Td>{p.posicao}</Td>
                    <Td>{p.marca || "—"}</Td>
                    <Td>{fmtKm(p.km_instalacao)}</Td>
                    <Td>{fmtKm(p.km_retirada ?? 0)}</Td>
                    <Td className="font-bold text-tur-green">
                      {fmtKm(vidaUtilPneu(p, veiculo) ?? 0)}
                    </Td>
                    <Td>
                      {custoPorKmPneu(p, veiculo) != null
                        ? `${brl(custoPorKmPneu(p, veiculo)!)}/km`
                        : "—"}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>
      </Section>

      <Section
        title="Combustível"
        description={`Consumo médio no mês: ${
          doMes.consumoMedio ? `${num(doMes.consumoMedio)} km/l` : "—"
        } · Custo por km: ${doMes.custoPorKm ? brl(doMes.custoPorKm) : "—"}`}
      >
        {abastecimentos.length === 0 ? (
          <Vazio>Nenhum abastecimento registrado.</Vazio>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>KM</Th>
                <Th>Litros</Th>
                <Th>R$/litro</Th>
                <Th>Total</Th>
                <Th>Posto</Th>
              </tr>
            </thead>
            <tbody>
              {abastecimentos.map((a) => (
                <tr key={a.id}>
                  <Td>{dataBR(a.data)}</Td>
                  <Td>{a.km ? fmtKm(a.km) : "—"}</Td>
                  <Td>{num(Number(a.litros))} L</Td>
                  <Td>{a.preco_litro ? brl(Number(a.preco_litro)) : "—"}</Td>
                  <Td className="font-bold">{brl(Number(a.valor_total))}</Td>
                  <Td>{a.posto || "—"}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Section>

      <Section
        title="Serviços realizados"
        description={`Receita acumulada: ${brl(total.receita)}.`}
      >
        {servicos.length === 0 ? (
          <Vazio>Nenhum serviço registrado.</Vazio>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>Tipo</Th>
                <Th>Cliente</Th>
                <Th>KM rodados</Th>
                <Th>Valor</Th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((s) => (
                <tr key={s.id}>
                  <Td>{dataBR(s.data)}</Td>
                  <Td className="uppercase">{s.tipo}</Td>
                  <Td>{s.cliente || "—"}</Td>
                  <Td>
                    {s.km_final != null && s.km_inicial != null
                      ? fmtKm(s.km_final - s.km_inicial)
                      : "—"}
                  </Td>
                  <Td className="font-bold text-tur-green">{brl(Number(s.valor))}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Section>

      <Section title="Histórico de quilometragem">
        {kmRegistros.length === 0 ? (
          <Vazio>Nenhum registro de quilometragem.</Vazio>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Data</Th>
                <Th>KM informado</Th>
                <Th>Rodados desde o último</Th>
                <Th>Observações</Th>
              </tr>
            </thead>
            <tbody>
              {kmRegistros.map((k) => (
                <tr key={k.id}>
                  <Td>{dataBR(k.data)}</Td>
                  <Td className="font-bold">{fmtKm(k.km)}</Td>
                  <Td className="text-tur-green">{fmtKm(k.km_rodados)}</Td>
                  <Td>{k.observacoes || "—"}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Section>
    </>
  );
}
