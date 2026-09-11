import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useFrota, useRecarregarFrota } from "@/hooks/use-frota";
import {
  TIPOS_VEICULO,
  dataBR,
  km as fmtKm,
  type Veiculo,
} from "@/lib/frota";
import {
  Field,
  Section,
  Td,
  Th,
  TableWrap,
  Vazio,
  btnGhost,
  btnPrimary,
  inputCls,
} from "@/components/frota/ui";

export const Route = createFileRoute("/_authenticated/frota/veiculos")({
  head: () => ({
    meta: [
      { title: "Veículos da frota — Matheus Tur" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VeiculosPage,
});

type FormState = {
  nome: string;
  numero: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  tipo: string;
  km_atual: string;
  data_aquisicao: string;
  status: string;
  intervalo_oleo_km: string;
  observacoes: string;
};

const vazio: FormState = {
  nome: "",
  numero: "",
  placa: "",
  marca: "",
  modelo: "",
  ano: "",
  tipo: "van",
  km_atual: "",
  data_aquisicao: "",
  status: "ativo",
  intervalo_oleo_km: "10000",
  observacoes: "",
};

function paraForm(v: Veiculo): FormState {
  return {
    nome: v.nome,
    numero: v.numero ?? "",
    placa: v.placa ?? "",
    marca: v.marca ?? "",
    modelo: v.modelo ?? "",
    ano: v.ano ? String(v.ano) : "",
    tipo: v.tipo,
    km_atual: String(v.km_atual),
    data_aquisicao: v.data_aquisicao ?? "",
    status: v.status,
    intervalo_oleo_km: String(v.intervalo_oleo_km),
    observacoes: v.observacoes ?? "",
  };
}

function VeiculosPage() {
  const { data, isLoading, error } = useFrota();
  const recarregar = useRecarregarFrota();
  const [form, setForm] = useState<FormState>(vazio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const set = (k: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((old) => ({ ...old, [k]: e.target.value }));

  function novo() {
    setForm(vazio);
    setEditandoId(null);
    setMostrarForm(true);
  }

  function editar(v: Veiculo) {
    setForm(paraForm(v));
    setEditandoId(v.id);
    setMostrarForm(true);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    const payload = {
      nome: form.nome,
      numero: form.numero || null,
      placa: form.placa || null,
      marca: form.marca || null,
      modelo: form.modelo || null,
      ano: form.ano ? Number(form.ano) : null,
      tipo: form.tipo,
      km_atual: Number(form.km_atual || 0),
      data_aquisicao: form.data_aquisicao || null,
      status: form.status,
      intervalo_oleo_km: Number(form.intervalo_oleo_km || 10000),
      observacoes: form.observacoes || null,
    };
    const { error } = editandoId
      ? await supabase.from("veiculos").update(payload).eq("id", editandoId)
      : await supabase.from("veiculos").insert(payload);
    setSalvando(false);
    if (error) {
      toast.error("Não foi possível salvar o veículo.");
      return;
    }
    toast.success(editandoId ? "Veículo atualizado." : "Veículo cadastrado.");
    setMostrarForm(false);
    setEditandoId(null);
    setForm(vazio);
    recarregar();
  }

  async function excluir(id: string) {
    const { error } = await supabase.from("veiculos").delete().eq("id", id);
    setConfirmId(null);
    if (error) {
      toast.error("Não foi possível excluir o veículo.");
      return;
    }
    toast.success("Veículo excluído.");
    recarregar();
  }

  if (isLoading) return <p className="mt-8 text-muted-foreground">Carregando...</p>;
  if (error)
    return (
      <p className="mt-8 rounded-lg border border-destructive/40 bg-card p-4 text-sm text-muted-foreground">
        Não foi possível carregar a frota. Somente contas de administrador têm acesso.
      </p>
    );

  const veiculos = data?.veiculos ?? [];

  return (
    <>
      <Section
        title="Veículos cadastrados"
        description="Cadastre vans, micro-ônibus, carros e qualquer outro veículo da operação."
        action={
          <button onClick={novo} className={btnPrimary}>
            + Novo veículo
          </button>
        }
      >
        {veiculos.length === 0 ? (
          <Vazio>
            Nenhum veículo cadastrado ainda. Comece cadastrando o primeiro carro da frota.
          </Vazio>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Veículo</Th>
                <Th>Nº</Th>
                <Th>Placa</Th>
                <Th>Modelo</Th>
                <Th>Tipo</Th>
                <Th>KM atual</Th>
                <Th>Aquisição</Th>
                <Th>Status</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map((v) => (
                <tr key={v.id}>
                  <Td>
                    <Link
                      to="/frota/$veiculoId"
                      params={{ veiculoId: v.id }}
                      className="font-semibold text-tur-green hover:underline"
                    >
                      {v.nome}
                    </Link>
                  </Td>
                  <Td>{v.numero || "—"}</Td>
                  <Td>{v.placa || "—"}</Td>
                  <Td>
                    {[v.marca, v.modelo].filter(Boolean).join(" ") || "—"}
                    {v.ano ? ` (${v.ano})` : ""}
                  </Td>
                  <Td>{v.tipo}</Td>
                  <Td className="font-bold">{fmtKm(v.km_atual)}</Td>
                  <Td>{dataBR(v.data_aquisicao)}</Td>
                  <Td>
                    <span
                      className={`rounded border px-2 py-0.5 text-xs font-bold uppercase ${
                        v.status === "ativo"
                          ? "border-tur-green/60 text-tur-green"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {v.status}
                    </span>
                  </Td>
                  <Td className="text-right">
                    {confirmId === v.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-muted-foreground">
                          Confirmar exclusão?
                        </span>
                        <button
                          onClick={() => excluir(v.id)}
                          className="rounded-md bg-destructive px-2 py-1 text-xs font-semibold uppercase text-destructive-foreground"
                        >
                          Sim
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded-md border border-border px-2 py-1 text-xs font-semibold uppercase text-muted-foreground"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => editar(v)}
                          aria-label="Editar veículo"
                          className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmId(v.id)}
                          aria-label="Excluir veículo"
                          className="rounded-md border border-border p-2 text-muted-foreground hover:border-destructive/60 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Section>

      {mostrarForm && (
        <Section title={editandoId ? "Editar veículo" : "Novo veículo"}>
          <form onSubmit={salvar} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Nome / identificação">
              <input
                className={inputCls}
                value={form.nome}
                onChange={set("nome")}
                placeholder="Carro 02"
                required
              />
            </Field>
            <Field label="Número do carro">
              <input className={inputCls} value={form.numero} onChange={set("numero")} />
            </Field>
            <Field label="Placa">
              <input
                className={inputCls}
                value={form.placa}
                onChange={set("placa")}
                placeholder="ABC-0000"
              />
            </Field>
            <Field label="Marca">
              <input className={inputCls} value={form.marca} onChange={set("marca")} />
            </Field>
            <Field label="Modelo">
              <input className={inputCls} value={form.modelo} onChange={set("modelo")} />
            </Field>
            <Field label="Ano">
              <input
                type="number"
                className={inputCls}
                value={form.ano}
                onChange={set("ano")}
              />
            </Field>
            <Field label="Tipo de veículo">
              <select className={inputCls} value={form.tipo} onChange={set("tipo")}>
                {TIPOS_VEICULO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Quilometragem atual">
              <input
                type="number"
                className={inputCls}
                value={form.km_atual}
                onChange={set("km_atual")}
              />
            </Field>
            <Field label="Data de aquisição">
              <input
                type="date"
                className={inputCls}
                value={form.data_aquisicao}
                onChange={set("data_aquisicao")}
              />
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={set("status")}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </Field>
            <Field
              label="Troca de óleo a cada (km)"
              hint="Configurável por veículo. Padrão: 10.000 km."
            >
              <input
                type="number"
                className={inputCls}
                value={form.intervalo_oleo_km}
                onChange={set("intervalo_oleo_km")}
              />
            </Field>
            <Field label="Observações">
              <input
                className={inputCls}
                value={form.observacoes}
                onChange={set("observacoes")}
              />
            </Field>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
              <button type="submit" disabled={salvando} className={btnPrimary}>
                {salvando ? "Salvando..." : "Salvar veículo"}
              </button>
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  setMostrarForm(false);
                  setEditandoId(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Section>
      )}
    </>
  );
}
