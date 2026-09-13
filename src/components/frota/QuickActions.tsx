import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Gauge,
  Fuel,
  Wrench,
  CircleDot,
  Receipt,
  BriefcaseBusiness,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRecarregarFrota } from "@/hooks/use-frota";
import {
  CATEGORIAS_DESPESA,
  COMBUSTIVEIS,
  POSICOES_PNEU,
  TIPOS_MANUTENCAO,
  TIPOS_SERVICO,
  hoje,
  km as fmtKm,
  type Veiculo,
} from "@/lib/frota";
import { Field, btnGhost, btnPrimary, inputCls, VeiculoSelect } from "./ui";

type Kind = "km" | "abastecimento" | "manutencao" | "pneu" | "despesa" | "servico";

const LABELS: Record<Kind, string> = {
  km: "Registrar KM",
  abastecimento: "Abastecimento",
  manutencao: "Manutenção",
  pneu: "Troca de pneu",
  despesa: "Despesa",
  servico: "Serviço realizado",
};

const ICONS: Record<Kind, typeof Gauge> = {
  km: Gauge,
  abastecimento: Fuel,
  manutencao: Wrench,
  pneu: CircleDot,
  despesa: Receipt,
  servico: BriefcaseBusiness,
};

const numOrNull = (v: string) => (v.trim() === "" ? null : Number(v));

export function QuickActions({
  veiculos,
  veiculoFixo,
  apenas,
}: {
  veiculos: Veiculo[];
  veiculoFixo?: string | undefined;
  apenas?: Kind[] | undefined;
}) {
  const [aberto, setAberto] = useState<Kind | null>(null);
  const kinds = apenas ?? (Object.keys(LABELS) as Kind[]);

  if (veiculos.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {kinds.map((k) => {
          const Icon = ICONS[k];
          return (
            <button
              key={k}
              onClick={() => setAberto(k)}
              className={k === "km" ? btnPrimary : btnGhost}
            >
              <Icon className="h-4 w-4" /> + {LABELS[k]}
            </button>
          );
        })}
      </div>

      <Dialog open={aberto !== null} onOpenChange={(o) => !o && setAberto(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {aberto && (
            <>
              <DialogHeader>
                <DialogTitle className="uppercase">{LABELS[aberto]}</DialogTitle>
                <DialogDescription>
                  Preencha os campos e salve. Os dados alimentam o painel de frota
                  automaticamente.
                </DialogDescription>
              </DialogHeader>
              <FormLancamento
                kind={aberto}
                veiculos={veiculos}
                veiculoFixo={veiculoFixo}
                onDone={() => setAberto(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormLancamento({
  kind,
  veiculos,
  veiculoFixo,
  onDone,
}: {
  kind: Kind;
  veiculos: Veiculo[];
  veiculoFixo?: string | undefined;
  onDone: () => void;
}) {
  const recarregar = useRecarregarFrota();
  const [veiculoId, setVeiculoId] = useState(veiculoFixo ?? veiculos[0]?.id ?? "");
  const [data, setData] = useState(hoje());
  const [f, setF] = useState<Record<string, string>>({});
  const [confirmaKm, setConfirmaKm] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const veiculo = veiculos.find((v) => v.id === veiculoId);
  const set = (k: string) => (e: { target: { value: string } }) =>
    setF((old) => ({ ...old, [k]: e.target.value }));

  const kmInformado = numOrNull(f["km"] ?? "");
  const kmMenor =
    veiculo != null && kmInformado != null && kmInformado < veiculo.km_atual;

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!veiculoId) return;
    if ((kind === "km" || kind === "abastecimento") && kmMenor && !confirmaKm) {
      toast.error("Quilometragem menor que a atual. Marque a confirmação para seguir.");
      return;
    }
    setSalvando(true);
    try {
      let error = null;
      if (kind === "km") {
        ({ error } = await supabase.from("km_registros").insert({
          veiculo_id: veiculoId,
          data,
          km: Number(f["km"] ?? 0),
          observacoes: f["observacoes"] || null,
        }));
        if (!error && kmMenor) {
          await supabase
            .from("veiculos")
            .update({ km_atual: Number(f["km"] ?? 0) })
            .eq("id", veiculoId);
        }
      } else if (kind === "abastecimento") {
        const litros = Number(f["litros"] ?? 0);
        const total = Number(f["valor_total"] ?? 0);
        ({ error } = await supabase.from("abastecimentos").insert({
          veiculo_id: veiculoId,
          data,
          km: numOrNull(f["km"] ?? ""),
          litros,
          valor_total: total,
          preco_litro: litros > 0 ? total / litros : null,
          posto: f["posto"] || null,
          combustivel: f["combustivel"] || null,
          observacoes: f["observacoes"] || null,
        }));
      } else if (kind === "manutencao") {
        ({ error } = await supabase.from("manutencoes").insert({
          veiculo_id: veiculoId,
          data,
          km: numOrNull(f["km"] ?? ""),
          tipo: f["tipo"] || "outros",
          descricao: f["descricao"] || null,
          valor: Number(f["valor"] ?? 0),
          fornecedor: f["fornecedor"] || null,
          proximo_km: numOrNull(f["proximo_km"] ?? ""),
          proxima_data: f["proxima_data"] || null,
          observacoes: f["observacoes"] || null,
        }));
      } else if (kind === "pneu") {
        ({ error } = await supabase.from("pneus").insert({
          veiculo_id: veiculoId,
          data_instalacao: data,
          km_instalacao: Number(f["km"] ?? veiculo?.km_atual ?? 0),
          posicao: f["posicao"] || "dianteiro esquerdo",
          marca: f["marca"] || null,
          modelo: f["modelo"] || null,
          medida: f["medida"] || null,
          valor: Number(f["valor"] ?? 0),
          quantidade: Number(f["quantidade"] ?? 1),
          observacoes: f["observacoes"] || null,
        }));
      } else if (kind === "despesa") {
        ({ error } = await supabase.from("despesas").insert({
          veiculo_id: veiculoId,
          data,
          categoria: f["categoria"] || "outros",
          valor: Number(f["valor"] ?? 0),
          km: numOrNull(f["km"] ?? ""),
          descricao: f["descricao"] || null,
          comprovante_url: f["comprovante_url"] || null,
        }));
      } else {
        ({ error } = await supabase.from("servicos").insert({
          veiculo_id: veiculoId,
          data,
          tipo: f["tipo"] || "fretamento",
          cliente: f["cliente"] || null,
          valor: Number(f["valor"] ?? 0),
          km_inicial: numOrNull(f["km_inicial"] ?? ""),
          km_final: numOrNull(f["km_final"] ?? ""),
          observacoes: f["observacoes"] || null,
        }));
      }

      if (error) {
        toast.error("Não foi possível salvar. Tente novamente.");
        return;
      }
      toast.success(`${LABELS[kind]} salvo com sucesso.`);
      await recarregar();
      onDone();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={salvar} className="space-y-3">
      <Field label="Veículo">
        <VeiculoSelect veiculos={veiculos} value={veiculoId} onChange={setVeiculoId} />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Data">
          <input
            type="date"
            className={inputCls}
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </Field>

        {kind !== "servico" && (
          <Field
            label={kind === "pneu" ? "KM da instalação" : "Quilometragem"}
            hint={veiculo ? `Atual: ${fmtKm(veiculo.km_atual)}` : undefined}
          >
            <input
              type="number"
              inputMode="numeric"
              className={inputCls}
              value={f["km"] ?? ""}
              onChange={set("km")}
              placeholder={String(veiculo?.km_atual ?? 0)}
              required={kind === "km"}
            />
          </Field>
        )}

        {kind === "abastecimento" && (
          <>
            <Field label="Litros">
              <input
                type="number"
                step="0.01"
                className={inputCls}
                value={f["litros"] ?? ""}
                onChange={set("litros")}
                required
              />
            </Field>
            <Field label="Valor total (R$)">
              <input
                type="number"
                step="0.01"
                className={inputCls}
                value={f["valor_total"] ?? ""}
                onChange={set("valor_total")}
                required
              />
            </Field>
            <Field label="Posto">
              <input className={inputCls} value={f["posto"] ?? ""} onChange={set("posto")} />
            </Field>
            <Field label="Combustível">
              <select
                className={inputCls}
                value={f["combustivel"] ?? ""}
                onChange={set("combustivel")}
              >
                <option value="">Selecione</option>
                {COMBUSTIVEIS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {kind === "manutencao" && (
          <>
            <Field label="Tipo de manutenção">
              <select className={inputCls} value={f["tipo"] ?? ""} onChange={set("tipo")}>
                {TIPOS_MANUTENCAO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Valor (R$)">
              <input
                type="number"
                step="0.01"
                className={inputCls}
                value={f["valor"] ?? ""}
                onChange={set("valor")}
                required
              />
            </Field>
            <Field label="Oficina / fornecedor">
              <input
                className={inputCls}
                value={f["fornecedor"] ?? ""}
                onChange={set("fornecedor")}
              />
            </Field>
            <Field label="Próxima manutenção (KM)" hint="Opcional — gera alerta">
              <input
                type="number"
                className={inputCls}
                value={f["proximo_km"] ?? ""}
                onChange={set("proximo_km")}
                placeholder={
                  f["tipo"] === "troca de óleo" && veiculo
                    ? String(
                        (numOrNull(f["km"] ?? "") ?? veiculo.km_atual) +
                          veiculo.intervalo_oleo_km,
                      )
                    : ""
                }
              />
            </Field>
            <Field label="Próxima manutenção (data)" hint="Opcional — gera alerta">
              <input
                type="date"
                className={inputCls}
                value={f["proxima_data"] ?? ""}
                onChange={set("proxima_data")}
              />
            </Field>
            <Field label="Descrição" className="sm:col-span-2">
              <input
                className={inputCls}
                value={f["descricao"] ?? ""}
                onChange={set("descricao")}
              />
            </Field>
          </>
        )}

        {kind === "pneu" && (
          <>
            <Field label="Posição">
              <select
                className={inputCls}
                value={f["posicao"] ?? ""}
                onChange={set("posicao")}
              >
                {POSICOES_PNEU.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Marca">
              <input className={inputCls} value={f["marca"] ?? ""} onChange={set("marca")} />
            </Field>
            <Field label="Modelo">
              <input
                className={inputCls}
                value={f["modelo"] ?? ""}
                onChange={set("modelo")}
              />
            </Field>
            <Field label="Medida">
              <input
                className={inputCls}
                value={f["medida"] ?? ""}
                onChange={set("medida")}
                placeholder="215/75 R16"
              />
            </Field>
            <Field label="Valor total (R$)">
              <input
                type="number"
                step="0.01"
                className={inputCls}
                value={f["valor"] ?? ""}
                onChange={set("valor")}
                required
              />
            </Field>
            <Field label="Quantidade">
              <input
                type="number"
                min="1"
                className={inputCls}
                value={f["quantidade"] ?? "1"}
                onChange={set("quantidade")}
              />
            </Field>
          </>
        )}

        {kind === "despesa" && (
          <>
            <Field label="Categoria">
              <select
                className={inputCls}
                value={f["categoria"] ?? ""}
                onChange={set("categoria")}
              >
                {CATEGORIAS_DESPESA.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Valor (R$)">
              <input
                type="number"
                step="0.01"
                className={inputCls}
                value={f["valor"] ?? ""}
                onChange={set("valor")}
                required
              />
            </Field>
            <Field label="Descrição" className="sm:col-span-2">
              <input
                className={inputCls}
                value={f["descricao"] ?? ""}
                onChange={set("descricao")}
              />
            </Field>
            <Field label="Link do comprovante" className="sm:col-span-2">
              <input
                className={inputCls}
                value={f["comprovante_url"] ?? ""}
                onChange={set("comprovante_url")}
                placeholder="https://..."
              />
            </Field>
          </>
        )}

        {kind === "servico" && (
          <>
            <Field label="Tipo de serviço">
              <select className={inputCls} value={f["tipo"] ?? ""} onChange={set("tipo")}>
                {TIPOS_SERVICO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cliente / serviço">
              <input
                className={inputCls}
                value={f["cliente"] ?? ""}
                onChange={set("cliente")}
              />
            </Field>
            <Field label="Valor gerado (R$)">
              <input
                type="number"
                step="0.01"
                className={inputCls}
                value={f["valor"] ?? ""}
                onChange={set("valor")}
                required
              />
            </Field>
            <Field label="KM inicial">
              <input
                type="number"
                className={inputCls}
                value={f["km_inicial"] ?? ""}
                onChange={set("km_inicial")}
              />
            </Field>
            <Field label="KM final">
              <input
                type="number"
                className={inputCls}
                value={f["km_final"] ?? ""}
                onChange={set("km_final")}
              />
            </Field>
          </>
        )}
      </div>

      {kind !== "despesa" && (
        <Field label="Observações">
          <textarea
            rows={2}
            className={inputCls}
            value={f["observacoes"] ?? ""}
            onChange={set("observacoes")}
          />
        </Field>
      )}

      {(kind === "km" || kind === "abastecimento") && kmMenor && (
        <label className="flex items-start gap-2 rounded-md border border-yellow-500/50 bg-yellow-500/10 p-3 text-sm">
          <input
            type="checkbox"
            checked={confirmaKm}
            onChange={(e) => setConfirmaKm(e.target.checked)}
            className="mt-1"
          />
          <span>
            A quilometragem informada é menor que a atual do veículo (
            {fmtKm(veiculo?.km_atual)}). Confirmo que é uma correção.
          </span>
        </label>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onDone} className={btnGhost}>
          Cancelar
        </button>
        <button type="submit" disabled={salvando} className={btnPrimary}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
