import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFrota, useRecarregarFrota } from "@/hooks/use-frota";
import { QuickActions } from "@/components/frota/QuickActions";
import {
  Section,
  Td,
  Th,
  TableWrap,
  Vazio,
  VeiculoSelect,
} from "@/components/frota/ui";
import {
  brl,
  custoPorKmPneu,
  dataBR,
  km as fmtKm,
  num,
  vidaUtilPneu,
} from "@/lib/frota";

export const Route = createFileRoute("/_authenticated/frota/historico")({
  head: () => ({
    meta: [
      { title: "Histórico da frota — Matheus Tur" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HistoricoPage,
});

type Aba = "km" | "combustivel" | "manutencao" | "pneus" | "despesas" | "servicos";

const ABAS: { id: Aba; label: string }[] = [
  { id: "km", label: "Quilometragem" },
  { id: "combustivel", label: "Combustível" },
  { id: "manutencao", label: "Manutenções" },
  { id: "pneus", label: "Pneus" },
  { id: "despesas", label: "Despesas" },
  { id: "servicos", label: "Serviços" },
];

function HistoricoPage() {
  const { data, isLoading, error } = useFrota();
  const recarregar = useRecarregarFrota();
  const [aba, setAba] = useState<Aba>("km");
  const [veiculoId, setVeiculoId] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);

  if (isLoading) return <p className="mt-8 text-muted-foreground">Carregando...</p>;
  if (error || !data)
    return (
      <p className="mt-8 rounded-lg border border-destructive/40 bg-card p-4 text-sm text-muted-foreground">
        Não foi possível carregar o histórico. Somente contas de administrador têm acesso.
      </p>
    );

  const filtra = <T extends { veiculo_id: string }>(arr: T[]) =>
    veiculoId ? arr.filter((i) => i.veiculo_id === veiculoId) : arr;
  const nomeVeiculo = (id: string) =>
    data.veiculos.find((v) => v.id === id)?.nome ?? "—";

  async function excluir(tabela: string, id: string) {
    const { error } = await supabase
      .from(tabela as "km_registros")
      .delete()
      .eq("id", id);
    setConfirm(null);
    if (error) {
      toast.error("Não foi possível excluir o registro.");
      return;
    }
    toast.success("Registro excluído.");
    recarregar();
  }

  function AcoesTd({ tabela, id }: { tabela: string; id: string }) {
    const key = `${tabela}:${id}`;
    return (
      <Td className="text-right">
        {confirm === key ? (
          <span className="flex items-center justify-end gap-2">
            <span className="text-xs text-muted-foreground">Confirmar exclusão?</span>
            <button
              onClick={() => excluir(tabela, id)}
              className="rounded-md bg-destructive px-2 py-1 text-xs font-semibold uppercase text-destructive-foreground"
            >
              Sim
            </button>
            <button
              onClick={() => setConfirm(null)}
              className="rounded-md border border-border px-2 py-1 text-xs font-semibold uppercase text-muted-foreground"
            >
              Não
            </button>
          </span>
        ) : (
          <button
            onClick={() => setConfirm(key)}
            aria-label="Excluir registro"
            className="rounded-md border border-border p-2 text-muted-foreground hover:border-destructive/60 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </Td>
    );
  }

  return (
    <>
      <Section title="Novo lançamento">
        <QuickActions veiculos={data.veiculos} veiculoFixo={veiculoId || undefined} />
      </Section>

      <Section title="Histórico completo">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-wrap gap-2">
            {ABAS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={`rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider ${
                  aba === a.id
                    ? "bg-tur-green/15 text-tur-green"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
          <div className="ml-auto w-full sm:w-64">
            <VeiculoSelect
              veiculos={data.veiculos}
              value={veiculoId}
              onChange={setVeiculoId}
              incluirTodos
            />
          </div>
        </div>

        <div className="mt-4">
          {aba === "km" &&
            (filtra(data.kmRegistros).length === 0 ? (
              <Vazio>Nenhum registro de quilometragem.</Vazio>
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Veículo</Th>
                    <Th>KM informado</Th>
                    <Th>Rodados desde o último</Th>
                    <Th>Observações</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {filtra(data.kmRegistros).map((r) => (
                    <tr key={r.id}>
                      <Td>{dataBR(r.data)}</Td>
                      <Td>{nomeVeiculo(r.veiculo_id)}</Td>
                      <Td className="font-bold">{fmtKm(r.km)}</Td>
                      <Td className="text-tur-green">{fmtKm(r.km_rodados)}</Td>
                      <Td>{r.observacoes || "—"}</Td>
                      <AcoesTd tabela="km_registros" id={r.id} />
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            ))}

          {aba === "combustivel" &&
            (filtra(data.abastecimentos).length === 0 ? (
              <Vazio>Nenhum abastecimento registrado.</Vazio>
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Veículo</Th>
                    <Th>KM</Th>
                    <Th>Litros</Th>
                    <Th>R$/litro</Th>
                    <Th>Total</Th>
                    <Th>Posto</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {filtra(data.abastecimentos).map((a) => (
                    <tr key={a.id}>
                      <Td>{dataBR(a.data)}</Td>
                      <Td>{nomeVeiculo(a.veiculo_id)}</Td>
                      <Td>{a.km ? fmtKm(a.km) : "—"}</Td>
                      <Td>{num(Number(a.litros))} L</Td>
                      <Td>{a.preco_litro ? brl(Number(a.preco_litro)) : "—"}</Td>
                      <Td className="font-bold">{brl(Number(a.valor_total))}</Td>
                      <Td>{a.posto || "—"}</Td>
                      <AcoesTd tabela="abastecimentos" id={a.id} />
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            ))}

          {aba === "manutencao" &&
            (filtra(data.manutencoes).length === 0 ? (
              <Vazio>Nenhuma manutenção registrada.</Vazio>
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Veículo</Th>
                    <Th>KM</Th>
                    <Th>Tipo</Th>
                    <Th>Descrição</Th>
                    <Th>Oficina</Th>
                    <Th>Próxima</Th>
                    <Th>Valor</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {filtra(data.manutencoes).map((m) => (
                    <tr key={m.id}>
                      <Td>{dataBR(m.data)}</Td>
                      <Td>{nomeVeiculo(m.veiculo_id)}</Td>
                      <Td>{m.km ? fmtKm(m.km) : "—"}</Td>
                      <Td className="uppercase">{m.tipo}</Td>
                      <Td>{m.descricao || "—"}</Td>
                      <Td>{m.fornecedor || "—"}</Td>
                      <Td>
                        {m.proximo_km ? fmtKm(m.proximo_km) : ""}
                        {m.proxima_data ? ` ${dataBR(m.proxima_data)}` : ""}
                        {!m.proximo_km && !m.proxima_data ? "—" : ""}
                      </Td>
                      <Td className="font-bold">{brl(Number(m.valor))}</Td>
                      <AcoesTd tabela="manutencoes" id={m.id} />
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            ))}

          {aba === "pneus" &&
            (filtra(data.pneus).length === 0 ? (
              <Vazio>Nenhum pneu registrado.</Vazio>
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Instalação</Th>
                    <Th>Veículo</Th>
                    <Th>Posição</Th>
                    <Th>Marca / modelo</Th>
                    <Th>KM instalação</Th>
                    <Th>KM retirada</Th>
                    <Th>Vida útil</Th>
                    <Th>Custo/km</Th>
                    <Th>Valor</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {filtra(data.pneus).map((p) => {
                    const v = data.veiculos.find((x) => x.id === p.veiculo_id);
                    const vida = vidaUtilPneu(p, v);
                    const custo = custoPorKmPneu(p, v);
                    return (
                      <tr key={p.id}>
                        <Td>{dataBR(p.data_instalacao)}</Td>
                        <Td>{nomeVeiculo(p.veiculo_id)}</Td>
                        <Td>{p.posicao}</Td>
                        <Td>{[p.marca, p.modelo].filter(Boolean).join(" ") || "—"}</Td>
                        <Td>{fmtKm(p.km_instalacao)}</Td>
                        <Td>
                          {p.km_retirada ? (
                            fmtKm(p.km_retirada)
                          ) : (
                            <button
                              onClick={async () => {
                                const atual = v?.km_atual ?? 0;
                                const { error } = await supabase
                                  .from("pneus")
                                  .update({
                                    km_retirada: atual,
                                    data_retirada: new Date().toISOString().slice(0, 10),
                                  })
                                  .eq("id", p.id);
                                if (error) {
                                  toast.error("Não foi possível registrar a retirada.");
                                  return;
                                }
                                toast.success("Retirada registrada.");
                                recarregar();
                              }}
                              className="rounded-md border border-border px-2 py-1 text-xs font-semibold uppercase text-muted-foreground hover:text-foreground"
                            >
                              Registrar retirada
                            </button>
                          )}
                        </Td>
                        <Td className="font-bold text-tur-green">
                          {vida != null ? fmtKm(vida) : "—"}
                          {p.km_retirada == null && vida != null ? " (em uso)" : ""}
                        </Td>
                        <Td>{custo != null ? `${brl(custo)}/km` : "—"}</Td>
                        <Td>
                          {brl(Number(p.valor))}
                          {p.quantidade > 1 ? ` (${p.quantidade}x)` : ""}
                        </Td>
                        <AcoesTd tabela="pneus" id={p.id} />
                      </tr>
                    );
                  })}
                </tbody>
              </TableWrap>
            ))}

          {aba === "despesas" &&
            (filtra(data.despesas).length === 0 ? (
              <Vazio>Nenhuma despesa registrada.</Vazio>
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Veículo</Th>
                    <Th>Categoria</Th>
                    <Th>Descrição</Th>
                    <Th>KM</Th>
                    <Th>Comprovante</Th>
                    <Th>Valor</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {filtra(data.despesas).map((d) => (
                    <tr key={d.id}>
                      <Td>{dataBR(d.data)}</Td>
                      <Td>{nomeVeiculo(d.veiculo_id)}</Td>
                      <Td className="uppercase">{d.categoria}</Td>
                      <Td>{d.descricao || "—"}</Td>
                      <Td>{d.km ? fmtKm(d.km) : "—"}</Td>
                      <Td>
                        {d.comprovante_url ? (
                          <a
                            href={d.comprovante_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-tur-green hover:underline"
                          >
                            abrir
                          </a>
                        ) : (
                          "—"
                        )}
                      </Td>
                      <Td className="font-bold">{brl(Number(d.valor))}</Td>
                      <AcoesTd tabela="despesas" id={d.id} />
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            ))}

          {aba === "servicos" &&
            (filtra(data.servicos).length === 0 ? (
              <Vazio>Nenhum serviço registrado.</Vazio>
            ) : (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Veículo</Th>
                    <Th>Tipo</Th>
                    <Th>Cliente</Th>
                    <Th>KM rodados</Th>
                    <Th>Valor gerado</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {filtra(data.servicos).map((s) => (
                    <tr key={s.id}>
                      <Td>{dataBR(s.data)}</Td>
                      <Td>{nomeVeiculo(s.veiculo_id)}</Td>
                      <Td className="uppercase">{s.tipo}</Td>
                      <Td>{s.cliente || "—"}</Td>
                      <Td>
                        {s.km_final != null && s.km_inicial != null
                          ? fmtKm(s.km_final - s.km_inicial)
                          : "—"}
                      </Td>
                      <Td className="font-bold text-tur-green">{brl(Number(s.valor))}</Td>
                      <AcoesTd tabela="servicos" id={s.id} />
                    </tr>
                  ))}
                </tbody>
              </TableWrap>
            ))}
        </div>
      </Section>

      <p className="mt-4 text-xs text-muted-foreground">
        Dica: abastecimentos, manutenções e pneus já entram como despesa automaticamente. Use a
        aba “Despesas” apenas para os outros gastos (documentação, seguro, lavagem, pedágio etc.)
        para não contar duas vezes.
      </p>
    </>
  );
}
