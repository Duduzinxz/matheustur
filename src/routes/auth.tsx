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

type Mode = "login" | "primeiro-acesso" | "recuperar";

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErro(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      setLoading(false);
      if (error)
        return setErro("Não foi possível entrar. Confira o e-mail e a senha.");
      navigate({ to: "/painel" });
      return;
    }

    if (mode === "primeiro-acesso") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/painel` },
      });
      setLoading(false);
      if (error)
        return setErro(
          "Este e-mail não tem permissão de acesso ou já possui conta. Use “Entrar” ou “Esqueci minha senha”.",
        );
      if (!data.session)
        return setMsg(
          "Conta criada! Confirme o e-mail que enviamos e depois entre com a senha que você escolheu.",
        );
      navigate({ to: "/painel" });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/redefinir-senha` },
    );
    setLoading(false);
    if (error) return setErro("Não foi possível enviar o e-mail agora.");
    setMsg(
      "Se este e-mail tiver acesso, enviamos um link para você criar uma nova senha.",
    );
  }

  const titulo =
    mode === "login"
      ? "Acesso da equipe"
      : mode === "primeiro-acesso"
        ? "Primeiro acesso"
        : "Esqueci minha senha";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pb-16 pt-28">
      <h1 className="text-3xl font-bold uppercase">{titulo}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login" &&
          "Entre para acompanhar as solicitações de viagem enviadas pelo site."}
        {mode === "primeiro-acesso" &&
          "Somente os e-mails autorizados da Matheus Tur podem criar conta. Escolha aqui a sua própria senha."}
        {mode === "recuperar" &&
          "Informe seu e-mail e enviaremos um link para você criar uma nova senha."}
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
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
          />
        </div>

        {mode !== "recuperar" && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
            />
            {mode === "primeiro-acesso" && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Use no mínimo 8 caracteres e uma senha só sua.
              </p>
            )}
          </div>
        )}

        {msg && <p className="text-sm text-tur-green">{msg}</p>}
        {erro && <p className="text-sm text-destructive">{erro}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-tur-green px-6 py-3 text-base font-bold uppercase tracking-wide text-tur-green-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {loading
            ? "Aguarde..."
            : mode === "login"
              ? "Entrar"
              : mode === "primeiro-acesso"
                ? "Criar minha conta"
                : "Enviar link"}
        </button>

        <div className="flex flex-col gap-2 pt-1">
          {mode !== "login" && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMsg(null);
                setErro(null);
              }}
              className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Já tenho conta — entrar
            </button>
          )}
          {mode !== "primeiro-acesso" && (
            <button
              type="button"
              onClick={() => {
                setMode("primeiro-acesso");
                setMsg(null);
                setErro(null);
              }}
              className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Primeiro acesso (e-mails autorizados)
            </button>
          )}
          {mode !== "recuperar" && (
            <button
              type="button"
              onClick={() => {
                setMode("recuperar");
                setMsg(null);
                setErro(null);
              }}
              className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Esqueci minha senha
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
