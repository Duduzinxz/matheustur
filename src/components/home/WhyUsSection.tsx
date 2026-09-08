import { Reveal } from "@/components/Reveal";

const REASONS = [
  {
    title: "Segurança",
    text: "Veículo revisado e documentação em dia para viajar sem preocupação.",
  },
  {
    title: "Conforto",
    text: "Assentos confortáveis e ar-condicionado para trajetos longos.",
  },
  {
    title: "Pontualidade",
    text: "Horários combinados e cumpridos, do início ao fim da viagem.",
  },
  {
    title: "Motorista experiente",
    text: "Anos de estrada, conhecendo bem as rotas de Minas e do Sudeste.",
  },
  {
    title: "Atendimento personalizado",
    text: "Cada viagem é combinada diretamente com você, sem intermediários.",
  },
];

export function WhyUsSection({ vanImageUrl }: { vanImageUrl: string }) {
  return (
    <section id="sobre" className="bg-card">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-tur-green">
            Sobre nós
          </p>
          <h2 className="mt-3 text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
            Por que viajar com a Matheus Tur
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Somos uma empresa de turismo e transporte de Ubá, Minas Gerais, que
            leva pessoas, grupos e empresas para seus destinos com segurança e
            conforto. Trabalhamos com atenção aos detalhes de cada viagem — do
            primeiro contato até a chegada.
          </p>

          <dl className="mt-10 space-y-6 border-t border-border pt-8">
            {REASONS.map((reason) => (
              <div
                key={reason.title}
                className="grid grid-cols-[1.1rem_1fr] gap-x-4"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-tur-green" />
                <div>
                  <dt className="text-sm font-bold uppercase tracking-wide">
                    {reason.title}
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {reason.text}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal direction="none" delay={120} className="order-1 lg:order-2">
          <div className="relative h-full min-h-[320px] overflow-hidden rounded-xl border border-border sm:min-h-[420px]">
            <img
              src={vanImageUrl}
              alt="Van da Matheus Tur estacionada, pronta para viagem"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-tur-green">
                Matheus Tur
              </p>
              <p className="text-sm font-semibold text-white">
                Turismo e Transporte — Ubá, MG
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
