import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { HeroVideo } from "@/components/HeroVideo";

const WHATSAPP_NUMBER = "5532999036855";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Vim pelo site e gostaria de planejar uma viagem com a Matheus Tur.",
)}`;

export function Hero({ posterUrl }: { posterUrl: string }) {
  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] items-end overflow-hidden bg-black sm:min-h-screen"
    >
      <HeroVideo posterUrl={posterUrl} />

      {/* Overlay para garantir contraste do texto sobre o vídeo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 32%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.92) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-32 sm:px-6 sm:pb-20 sm:pt-40">
        <p className="fade-up text-xs font-bold uppercase tracking-[0.4em] text-tur-green">
          Ubá — MG
        </p>

        <h1
          className="fade-up mt-4 max-w-2xl text-4xl font-bold uppercase leading-[0.98] text-white sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "90ms" }}
        >
          Viaje com conforto.
          <br />
          Chegue com <span className="text-tur-green">tranquilidade.</span>
        </h1>

        <p
          className="fade-up mt-5 max-w-md text-base text-silver/90 sm:text-lg"
          style={{ animationDelay: "180ms" }}
        >
          Turismo, excursões e fretamento com segurança, conforto e pontualidade
          — saindo de Ubá para todo o Sudeste.
        </p>

        <div
          className="fade-up mt-8 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "270ms" }}
        >
          <Link
            to="/simulacao"
            className="rounded-md bg-tur-green px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-tur-green-foreground transition-transform hover:scale-[1.03] sm:text-base"
          >
            Planeje sua viagem
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10 sm:text-base"
          >
            <MessageCircle className="size-4" strokeWidth={2.5} />
            Falar no WhatsApp
          </a>
        </div>

        <p
          className="fade-up mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-silver/70"
          style={{ animationDelay: "340ms" }}
        >
          Atendemos MG · SP · RJ · ES
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-transparent via-tur-green to-transparent" />
    </section>
  );
}
