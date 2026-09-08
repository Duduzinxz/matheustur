import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoUrl from "@/assets/logo-matheus-tur.png";
import { ThemeToggle } from "@/components/ThemeToggle";

const WHATSAPP_NUMBER = "5532999036855";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Vim pelo site e gostaria de mais informações sobre as viagens.",
)}`;

const NAV_LINKS = [
  { label: "Início", href: "/#top" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Destinos", href: "/#destinos" },
  { label: "Sobre nós", href: "/#sobre" },
];

/** Rola suavemente até uma seção da própria Home; em outras rotas, navega normalmente. */
function useSectionLinkHandler(closeMenu: () => void) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    if (pathname !== "/") return; // deixa o navegador navegar para "/#id"
    const id = href.split("#")[1];
    if (!id || id === "top") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleSectionClick = useSectionLinkHandler(() => setMenuOpen(false));
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Só a Home tem o vídeo escuro do herói por trás do topo da página; nas
  // demais rotas o fundo já é o do tema (claro por padrão), então a navbar
  // não pode ficar transparente com texto claro — ficaria ilegível.
  const isHome = pathname === "/";
  const overHero = isHome && !scrolled && !menuOpen;
  const showChrome = scrolled || menuOpen || !isHome;
  const linkColorClass = overHero
    ? "text-white/85 hover:text-tur-green"
    : "text-foreground/80 hover:text-tur-green";

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: showChrome
          ? "color-mix(in oklab, var(--background) 88%, transparent)"
          : "transparent",
        backdropFilter: showChrome ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 8px 30px -12px rgba(0,0,0,0.25)" : "none",
        borderBottom: showChrome
          ? "1px solid var(--border)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src={logoUrl}
            alt="Matheus Tur — Turismo e Transporte"
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.15em] lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={handleSectionClick(link.href)}
              className={`transition-colors ${linkColorClass}`}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/simulacao"
            className={`transition-colors ${linkColorClass}`}
            activeProps={{ className: "text-tur-green" }}
          >
            Simular viagem
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle className={linkColorClass} />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-md bg-tur-green px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-tur-green-foreground transition-transform hover:scale-105 sm:inline-flex"
          >
            <MessageCircle className="size-4" strokeWidth={2.5} />
            Falar no WhatsApp
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className={`grid size-10 place-items-center rounded-md border border-border transition-colors lg:hidden ${linkColorClass}`}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:hidden"
        style={{
          maxHeight: menuOpen ? "420px" : "0px",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <nav className="flex flex-col gap-1 border-t border-border bg-background/98 px-4 py-4 backdrop-blur">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={handleSectionClick(link.href)}
              className="rounded-md px-3 py-3 text-sm font-bold uppercase tracking-wide text-foreground/80 transition-colors hover:bg-secondary hover:text-tur-green"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/simulacao"
            onClick={() => setMenuOpen(false)}
            className="rounded-md px-3 py-3 text-sm font-bold uppercase tracking-wide text-foreground/80 transition-colors hover:bg-secondary hover:text-tur-green"
          >
            Simular viagem
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 rounded-md bg-tur-green px-4 py-3 text-sm font-bold uppercase tracking-wide text-tur-green-foreground"
          >
            <MessageCircle className="size-4" strokeWidth={2.5} />
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
