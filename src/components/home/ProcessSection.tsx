import { Calculator, CheckCircle2, MapPin, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const STEPS = [
  {
    icon: MapPin,
    title: "Escolha seu destino",
    text: "Diga de onde você sai e para onde quer ir — perto ou em outro estado.",
  },
  {
    icon: Calculator,
    title: "Simule o valor",
    text: "Receba uma estimativa de quilometragem e valor na hora, direto no site.",
  },
  {
    icon: MessageCircle,
    title: "Confirme no WhatsApp",
    text: "Envie a simulação com um clique e combine os detalhes com a gente.",
  },
  {
    icon: CheckCircle2,
    title: "Embarque tranquilo",
    text: "Motorista experiente, veículo revisado e saída no horário combinado.",
  },
];

export function ProcessSection() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-tur-green">
            Como funciona
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
            Da simulação ao embarque, em 4 passos simples.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Linha conectando os passos (somente desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={i * 110}>
                <div className="relative">
                  <div className="relative z-10 grid size-12 place-items-center rounded-full border-2 border-tur-green bg-card text-tur-green">
                    <Icon className="size-5" strokeWidth={2} />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-tur-green">
                    Passo {i + 1}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold uppercase tracking-wide">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
