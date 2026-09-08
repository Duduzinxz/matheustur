import { Building2, MapPinned, Route, Users } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const SERVICES = [
  {
    icon: MapPinned,
    title: "Excursões",
    text: "Viagens para praias, cidades históricas, serras e eventos — no ritmo que o seu grupo quiser.",
  },
  {
    icon: Building2,
    title: "Fretamento",
    text: "Transporte contínuo para empresas, escolas, igrejas e grupos, com saída de Ubá e região.",
  },
  {
    icon: Route,
    title: "Viagens personalizadas",
    text: "Origem e destino sob medida. Simule a rota no site e receba o orçamento direto no WhatsApp.",
  },
  {
    icon: Users,
    title: "Transporte para eventos",
    text: "Soluções de transporte em grupo para casamentos, formaturas e ocasiões especiais.",
  },
];

export function ServicesSection() {
  return (
    <section id="servicos" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-tur-green">
            O que fazemos
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold uppercase leading-[1.05] sm:text-5xl">
            Transporte pensado para cada viagem.
          </h2>
        </Reveal>

        <div className="mt-14 divide-y divide-border border-t border-border">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.title} delay={i * 90}>
                <div className="group grid items-center gap-4 py-8 transition-colors sm:grid-cols-[auto_1fr_auto] sm:gap-10">
                  <span className="font-display text-4xl font-bold text-border transition-colors group-hover:text-tur-green/40 sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-wide sm:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 max-w-lg text-sm text-muted-foreground sm:text-base">
                      {service.text}
                    </p>
                  </div>
                  <Icon
                    className="hidden size-9 shrink-0 text-silver/40 transition-colors group-hover:text-tur-green sm:block"
                    strokeWidth={1.5}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
