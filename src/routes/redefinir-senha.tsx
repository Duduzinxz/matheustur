import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/redefinir-senha")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Criar nova senha — Matheus Tur" },
      {
        name: "description",
        content:
          "Defina uma nova senha de acesso ao painel de solicitações da Matheus Tur.",
      },
      { property: "og:title", content: "Criar nova senha — Matheus Tur" },
      {
        property: "og:description",
        content: "Defina uma nova senha de acesso da equipe Matheus Tur.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RedefinirSenhaPage,
});

function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const [pronto, setPronto] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // O link do e-mail traz uma sessão de recuperação; espera ela ficar ativa.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setPronto(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) setPronto(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMsg(null);
    if (senha !== confirma) return setErro("As senhas não são iguais.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setLoading(false);
    if (error)
      return setErro(
        "Não foi possível salvar a nova senha. Peça um novo link e tente de novo.",
      );
    setMsg("Senha atualizada! Levando você ao painel...");
    setTimeout(() => navigate({ to: "/painel" }), 1200);
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pb-16 pt-28">
      <h1 className="text-3xl font-bold uppercase">Criar nova senha</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {pronto
          ? "Escolha uma senha nova, só sua, com pelo menos 8 caracteres."
          : "Abra esta página pelo link que enviamos por e-mail para poder trocar a senha."}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Nova senha
          </label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Repetir a nova senha
          </label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
          />
        </div>

        {msg && <p className="text-sm text-tur-green">{msg}</p>}
        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <button
          type="submit"
          disabled={loading || !pronto}
          className="w-full rounded-md bg-tur-green px-6 py-3 text-base font-bold uppercase tracking-wide text-tur-green-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </main>
  );
}
