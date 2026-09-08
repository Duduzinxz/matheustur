import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const WHATSAPP_NUMBER = "5532999036855";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Gostaria de um orçamento de viagem com a Matheus Tur.",
)}`;

export function SimulationCTA() {
  return (
    <section className="border-t border-border bg-card">
      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-16 sm:flex-row sm:items-center sm:px-6 sm:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-tur-green">
              Orçamento
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
              Quanto custa a sua próxima viagem?
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Informe sua origem e destino e receba uma estimativa de
              quilometragem — tudo pronto para enviar direto no nosso WhatsApp.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              to="/simulacao"
              className="rounded-md bg-tur-green px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-tur-green-foreground transition-transform hover:scale-[1.03]"
            >
              Fazer simulação
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-8 py-4 text-sm font-bold uppercase tracking-wide text-silver transition-colors hover:border-tur-green hover:text-tur-green"
            >
              <MessageCircle className="size-4" strokeWidth={2.5} />
              WhatsApp
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
