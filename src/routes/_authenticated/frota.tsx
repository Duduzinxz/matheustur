import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/frota")({
  component: FrotaLayout,
});

const LINKS = [
  { to: "/frota", label: "Dashboard", exact: true },
  { to: "/frota/veiculos", label: "Veículos" },
  { to: "/frota/historico", label: "Histórico" },
  { to: "/frota/fechamento", label: "Fechamento" },
] as const;

function FrotaLayout() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-tur-green">
            Gestão de frota
          </p>
          <h1 className="mt-1 text-4xl font-bold uppercase">Controle da frota</h1>
        </div>
        <Link
          to="/painel"
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
        >
          Solicitações
        </Link>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-border pb-2">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: "exact" in l ? l.exact : false }}
            className="rounded-md px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            activeProps={{ className: "bg-tur-green/15 text-tur-green" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <Outlet />
    </main>
  );
}
