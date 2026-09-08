import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import logoUrl from "@/assets/logo-matheus-tur.png";

const WHATSAPP_NUMBER = "5532999036855";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Vim pelo site e gostaria de mais informações sobre as viagens.",
)}`;

const LINKS = [
  { label: "Início", href: "/#top" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Destinos", href: "/#destinos" },
];

export function Footer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function handleClick(href: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== "/") return;
      const id = href.split("#")[1];
      const el = id && id !== "top" ? document.getElementById(id) : null;
      e.preventDefault();
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <img
              src={logoUrl}
              alt="Matheus Tur — Turismo e Transporte"
              className="h-11 w-auto"
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Ubá — Minas Gerais
            </p>
            <p className="text-sm font-semibold uppercase tracking-wide text-tur-green">
              Turismo · Excursões · Fretamento
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm font-semibold uppercase tracking-wide">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleClick(link.href)}
                className="text-muted-foreground transition-colors hover:text-tur-green"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/simulacao"
              className="text-muted-foreground transition-colors hover:text-tur-green"
            >
              Simular viagem
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-tur-green"
            >
              <MessageCircle className="size-4" strokeWidth={2.5} />
              WhatsApp
            </a>
          </nav>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Matheus Tur. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
