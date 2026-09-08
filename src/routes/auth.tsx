import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso restrito — Matheus Tur" },
      {
        name: "description",
        content:
          "Área de acesso da equipe Matheus Tur para acompanhar as solicitações de viagem.",
      },
      { property: "og:title", content: "Acesso restrito — Matheus Tur" },
      { property: "og:description", content: "Entrada da equipe Matheus Tur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error)
        return setMsg("Não foi possível entrar. Confira o e-mail e a senha.");
      navigate({ to: "/painel" });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/painel` },
      });
      setLoading(false);
      if (error)
        return setMsg("Não foi possível criar a conta: " + error.message);
      if (!data.session)
        return setMsg(
          "Conta criada! Confirme o e-mail que enviamos para entrar.",
        );
      navigate({ to: "/painel" });
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pb-16 pt-28">
      <h1 className="text-3xl font-bold uppercase">Acesso da equipe</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Entre para acompanhar as solicitações de viagem enviadas pelo site.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Senha
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
          />
        </div>
        {msg && <p className="text-sm text-tur-green">{msg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-tur-green px-6 py-3 text-base font-bold uppercase tracking-wide text-tur-green-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMsg(null);
          }}
          className="w-full text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          {mode === "login"
            ? "Primeiro acesso? Criar conta"
            : "Já tenho conta — entrar"}
        </button>
      </form>
    </main>
  );
}
