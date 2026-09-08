import { createFileRoute } from "@tanstack/react-router";
import vanUrl from "@/assets/van-matheus-tur.png";
import { Hero } from "@/components/home/Hero";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { SimulationCTA } from "@/components/home/SimulationCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matheus Tur | Turismo e Transporte em Ubá MG" },
      {
        name: "description",
        content:
          "Matheus Tur: turismo, excursões e fretamento em Ubá, Minas Gerais. Viagens com segurança, conforto e pontualidade para MG, SP, RJ e ES. Simule sua viagem e peça orçamento pelo WhatsApp.",
      },
      {
        property: "og:title",
        content: "Matheus Tur | Turismo e Transporte em Ubá MG",
      },
      {
        property: "og:description",
        content:
          "Viagens, excursões e fretamento saindo de Ubá MG. Simule sua rota e receba o orçamento pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero posterUrl={vanUrl} />
      <ServicesSection />
      <ProcessSection />
      <WhyUsSection vanImageUrl={vanUrl} />
      <DestinationsSection />
      <SimulationCTA />
    </main>
  );
}
