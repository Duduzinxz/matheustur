import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getStateStyle } from "@/lib/cities";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel de solicitações — Matheus Tur" },
      {
        name: "description",
        content:
          "Acompanhe as simulações de viagem enviadas pelo site da Matheus Tur.",
      },
      { property: "og:title", content: "Painel de solicitações — Matheus Tur" },
      {
        property: "og:description",
        content: "Solicitações de viagem recebidas pelo site.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PainelPage,
});

type Solicitacao = {
  id: string;
  origem_cidade: string;
  origem_uf: string;
  destino_cidade: string;
  destino_uf: string;
  data_viagem: string | null;
  horario: string | null;
  passageiros: number | null;
  km_total: number;
  status: string;
  created_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "A combinar";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "cancelado", label: "Cancelado" },
  { value: "concluido", label: "Concluído" },
];

const STATUS_CLASS: Record<string, string> = {
  novo: "border-silver/40 text-silver",
  em_andamento: "border-tur-green/60 text-tur-green",
  cancelado: "border-destructive/60 text-destructive",
  concluido: "border-border text-muted-foreground",
};

function PainelPage() {
  const navigate = useNavigate();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["solicitacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solicitacoes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Solicitacao[];
    },
  });

  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  useEffect(() => {
    const channel = supabase
      .channel("solicitacoes-novas")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "solicitacoes" },
        (payload) => {
          const nova = payload.new as Solicitacao;
          toast.success("Nova simulação recebida!", {
            description: `${nova.origem_cidade} (${nova.origem_uf}) → ${nova.destino_cidade} (${nova.destino_uf})`,
            duration: 10000,
          });
          refetchRef.current();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function mudarStatus(id: string, status: string) {
    const { error } = await supabase
      .from("solicitacoes")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Não foi possível atualizar a situação.");
      return;
    }
    toast.success("Situação atualizada.");
    refetch();
  }

  async function excluir(id: string) {
    const { error } = await supabase.from("solicitacoes").delete().eq("id", id);
    setConfirmId(null);
    if (error) {
      toast.error("Não foi possível excluir a solicitação.");
      return;
    }
    toast.success("Solicitação excluída.");
    refetch();
  }

  async function sair() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-12 pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-tur-green">
            Área da equipe
          </p>
          <h1 className="mt-1 text-4xl font-bold uppercase">
            Solicitações de viagem
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tudo que os clientes simularam e enviaram pelo WhatsApp aparece
            aqui.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="rounded-md border border-silver/40 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-silver hover:bg-silver/10"
          >
            Atualizar
          </button>
          <button
            onClick={sair}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
          >
            Sair
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="mt-10 text-muted-foreground">
          Carregando solicitações...
        </p>
      )}
      {error && (
        <p className="mt-10 rounded-lg border border-destructive/40 bg-card p-4 text-sm text-muted-foreground">
          Não foi possível carregar as solicitações. Somente contas de
          administrador têm acesso a esta lista.
        </p>
      )}

      {data && data.length === 0 && (
        <p className="mt-10 rounded-lg border border-border bg-card p-6 text-muted-foreground">
          Nenhuma solicitação ainda. Assim que um cliente enviar uma simulação
          pelo site, ela aparece aqui.
        </p>
      )}

      {data && data.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Recebido</th>
                <th className="px-4 py-3">Origem</th>
                <th className="px-4 py-3">Destino</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Horário</th>
                <th className="px-4 py-3">Passageiros</th>
                <th className="px-4 py-3">Km total</th>
                <th className="px-4 py-3">Situação</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => {
                const oStyle = getStateStyle(s.origem_uf);
                const dStyle = getStateStyle(s.destino_uf);
                return (
                  <tr
                    key={s.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(s.created_at).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{s.origem_cidade}</span>{" "}
                      <span
                        className="ml-1 rounded px-1.5 py-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: oStyle.color,
                          color: oStyle.foreground,
                        }}
                      >
                        {s.origem_uf}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">{s.destino_cidade}</span>{" "}
                      <span
                        className="ml-1 rounded px-1.5 py-0.5 text-xs font-bold"
                        style={{
                          backgroundColor: dStyle.color,
                          color: dStyle.foreground,
                        }}
                      >
                        {s.destino_uf}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(s.data_viagem)}</td>
                    <td className="px-4 py-3">{s.horario || "A combinar"}</td>
                    <td className="px-4 py-3">{s.passageiros ?? "—"}</td>
                    <td className="px-4 py-3 font-bold text-tur-green">
                      ~{s.km_total} km
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
