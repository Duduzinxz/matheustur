import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { CitySelect } from "@/components/CitySelect";
import { GARAGE, getStateStyle, isUba, roadKm, type City } from "@/lib/cities";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/simulacao")({
  head: () => ({
    meta: [
      { title: "Simulação de Viagem — Matheus Tur | Ubá MG" },
      {
        name: "description",
        content:
          "Simule sua viagem com a Matheus Tur: informe a origem e o destino, veja a quilometragem estimada e envie tudo direto para o nosso WhatsApp.",
      },
      { property: "og:title", content: "Simulação de Viagem — Matheus Tur" },
      {
        property: "og:description",
        content:
          "Calcule a quilometragem da sua viagem saindo de Ubá MG e envie a simulação pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SimulacaoPage,
});

const WHATSAPP_NUMBER = "5532999036855";

const RouteMap = lazy(() => import("@/components/RouteMap"));

function formatDate(value: string) {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

function SimulacaoPage() {
  const [origin, setOrigin] = useState<City | null>(null);
  const [destination, setDestination] = useState<City | null>(null);
  const [passengers, setPassengers] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [rota, setRota] = useState<{
    deslocamentoKm: number;
    trechoKm: number;
    geometry: [number, number][];
  } | null>(null);

  // Busca o trajeto real pelas rodovias (garagem → origem → destino)
  useEffect(() => {
    if (!origin || !destination) {
      setRota(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const coords = [GARAGE, origin, destination]
          .map((c) => `${c.lng},${c.lat}`)
          .join(";");
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("rota indisponível");
        const json = await res.json();
        const leg0 = json.routes?.[0]?.legs?.[0]?.distance;
        const leg1 = json.routes?.[0]?.legs?.[1]?.distance;
        const coordsArr = json.routes?.[0]?.geometry?.coordinates;
        if (
          typeof leg0 !== "number" ||
          typeof leg1 !== "number" ||
          !Array.isArray(coordsArr)
        ) {
          throw new Error("rota incompleta");
        }
        setRota({
          deslocamentoKm: Math.round(leg0 / 1000),
          trechoKm: Math.round(leg1 / 1000),
          geometry: coordsArr.map(
            ([lng, lat]: [number, number]) => [lat, lng] as [number, number],
          ),
        });
      } catch {
        if (!controller.signal.aborted) setRota(null);
      }
    }, 400);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [origin, destination]);

  const sim = useMemo(() => {
    if (!origin || !destination) return null;
    const origemEhUba = isUba(origin);
    const deslocamento = origemEhUba
      ? 0
      : (rota?.deslocamentoKm ?? roadKm(GARAGE, origin));
    const trecho = rota?.trechoKm ?? roadKm(origin, destination);
    return {
      deslocamento,
      trecho,
      total: deslocamento + trecho,
      origemEhUba,
      rotaReal: !!rota,
    };
  }, [origin, destination, rota]);

  const whatsappUrl = useMemo(() => {
    if (!origin || !destination || !sim) return null;
    const lines = [
      "*SIMULACAO DE VIAGEM — MATHEUS TUR*",
      "Olá! Fiz uma simulação de viagem no site:",
      "",
      "*TRAJETO*",
      `🚐 *Ponto fixo (garagem):* Ubá - MG`,
      `📍 *Origem (1ª parada):* ${origin.name} - ${origin.uf}`,
      `🏁 *Destino final:* ${destination.name} - ${destination.uf}`,
      "",
      "*DATA E HORA DESEJADAS*",
      `📅 *Data de ida:* ${formatDate(date) ?? "a combinar"}`,
      `⏰ *Horário de ida:* ${time || "a combinar"}`,
      `📅 *Data de volta:* ${formatDate(returnDate) ?? "a combinar"}`,
      `⏰ *Horário de volta:* ${returnTime || "a combinar"}`,
      "",
      "*DETALHES*",
      `👥 *Passageiros:* ${passengers || "a combinar"}`,
      sim.origemEhUba
        ? `• Garagem → origem: 0 km (origem em Ubá, não contabilizado)`
        : `• Garagem → origem: ~${sim.deslocamento} km`,
      `• Origem → destino: ~${sim.trecho} km`,
      `*• Quilometragem total estimada: ~${sim.total} km*`,
      "",
      "Aguardo o orçamento. Obrigado!",
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [
    origin,
    destination,
    passengers,
    date,
    time,
    returnDate,
    returnTime,
    sim,
  ]);

  async function registrarSolicitacao() {
    if (!origin || !destination || !sim) return;
    try {
      await supabase.from("solicitacoes").insert({
        origem_cidade: origin.name,
        origem_uf: origin.uf,
        destino_cidade: destination.name,
        destino_uf: destination.uf,
        data_viagem: date || null,
        horario: time || null,
        data_volta: returnDate || null,
        horario_volta: returnTime || null,
        passageiros: passengers ? Number(passengers) : null,
        km_deslocamento: sim.deslocamento,
        km_trecho: sim.trecho,
        km_total: sim.total,
      });
    } catch {
      // envio pelo WhatsApp continua mesmo se o registro falhar
    }
  }

  const originStyle = origin ? getStateStyle(origin.uf) : null;
  const destinationStyle = destination ? getStateStyle(destination.uf) : null;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-12 pt-28 sm:pb-16 sm:pt-32">
      <p className="fade-up text-xs font-bold uppercase tracking-[0.3em] text-tur-green">
        Simulação de viagem
      </p>
      <h1
        className="fade-up mt-2 text-4xl font-bold uppercase sm:text-5xl"
        style={{ animationDelay: "80ms" }}
      >
        Monte sua rota
      </h1>
      <p
        className="fade-up mt-3 text-muted-foreground"
        style={{ animationDelay: "160ms" }}
      >
        Informe a origem e o destino. A quilometragem sai da garagem em Ubá MG —
        se a primeira parada for em Ubá, o deslocamento até você não é
        contabilizado.
      </p>

      <div
        className="fade-up mt-10 space-y-6"
        style={{ animationDelay: "240ms" }}
      >
        {/* Ponto fixo */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <span className="grid size-8 place-items-center rounded-full border-2 border-silver text-xs font-bold text-silver">
              1
            </span>
            <span className="mt-1 h-10 w-px bg-border" />
          </div>
          <div className="flex-1 rounded-lg border border-silver/30 bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Ponto fixo
            </p>
            <p className="mt-1 text-lg font-semibold">Garagem do veículo</p>
            <p className="text-sm font-semibold text-tur-green">Ubá — MG</p>
          </div>
        </div>

        {/* Primeira parada */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <span
              className="grid size-8 place-items-center rounded-full border-2 text-xs font-bold"
              style={{
                borderColor: originStyle?.color ?? "var(--tur-green)",
                color: originStyle?.color ?? "var(--tur-green)",
              }}
            >
              2
            </span>
            <span className="mt-1 h-10 w-px bg-border" />
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card p-4">
            <CitySelect
              label="Primeira parada — ponto de origem do cliente"
              hint="Priorizamos Minas Gerais e estados vizinhos. Se for Ubá, a quilometragem da garagem até você não conta."
              value={origin}
              onChange={setOrigin}
            />
          </div>
        </div>

        {/* Destino */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <span
              className="grid size-8 place-items-center rounded-full border-2 text-xs font-bold"
              style={{
                backgroundColor: destinationStyle?.color ?? "var(--tur-green)",
                borderColor: destinationStyle?.color ?? "var(--tur-green)",
                color:
                  destinationStyle?.foreground ?? "var(--tur-green-foreground)",
              }}
            >
              3
            </span>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card p-4">
            <CitySelect
              label="Ponto final — destino da viagem"
              value={destination}
              onChange={setDestination}
              excludeUba
            />
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Passageiros (opcional)
              </label>
              <input
                value={passengers}
                onChange={(e) =>
                  setPassengers(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                placeholder="Ex.: 12"
                inputMode="numeric"
                className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none placeholder:text-muted-foreground focus:border-tur-green"
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Data de ida
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Horário de ida
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Data de volta
                </label>
                <input
                  type="date"
                  value={returnDate}
                  min={date || undefined}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Horário de volta
                </label>
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 outline-none focus:border-tur-green"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prévia do trajeto no mapa */}
      <div
        className="fade-up mt-8 overflow-hidden rounded-xl border border-border bg-card"
        style={{ animationDelay: "300ms" }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-silver">
            Prévia do trajeto
          </h2>
          <span className="text-xs text-muted-foreground">
            {rota
              ? "Trajeto real pelas rodovias"
              : "Garagem → origem → destino"}
          </span>
        </div>
        <ClientOnly
          fallback={
            <div className="h-72 w-full animate-pulse bg-secondary sm:h-96" />
          }
        >
          <Suspense
            fallback={
              <div className="h-72 w-full animate-pulse bg-secondary sm:h-96" />
            }
          >
            <RouteMap
              origin={origin}
              destination={destination}
              route={rota?.geometry ?? null}
            />
          </Suspense>
        </ClientOnly>
      </div>

      {/* Legenda de cores */}
      <div
        className="fade-up mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide"
        style={{ animationDelay: "320ms" }}
      >
        <span className="text-muted-foreground">Cores por estado:</span>
        {[
          { uf: "MG", label: "Minas Gerais" },
          { uf: "SP", label: "São Paulo" },
          { uf: "RJ", label: "Rio de Janeiro" },
          { uf: "ES", label: "Espírito Santo" },
        ].map((s) => {
          const style = getStateStyle(s.uf);
          return (
            <span
              key={s.uf}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1"
              style={{
                borderColor: style.border,
                backgroundColor: style.surface,
                color: style.color,
              }}
            >
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: style.dot }}
              />
              {s.uf}
            </span>
          );
        })}
      </div>

      {sim && (
        <div className="fade-up mt-8 rounded-xl border border-tur-green/40 bg-card p-6">
          <h2 className="text-2xl font-bold uppercase">Resumo da simulação</h2>
          <dl className="mt-4 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">Garagem → origem</dt>
              <dd className="font-semibold">
                {sim.origemEhUba ? (
                  <span className="text-tur-green">
                    0 km — Ubá, não contabilizado
                  </span>
                ) : (
                  `~${sim.deslocamento} km`
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">Origem → destino</dt>
              <dd className="font-semibold">~{sim.trecho} km</dd>
            </div>
            <div className="flex justify-between gap-4 pt-1 text-lg">
              <dt className="font-bold uppercase">Total estimado</dt>
              <dd className="font-bold text-tur-green">~{sim.total} km</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            {sim.rotaReal
              ? "Quilometragem calculada pelo trajeto real nas rodovias. O valor final é confirmado no orçamento pelo WhatsApp."
              : "Quilometragem estimada por rota rodoviária. O valor final é confirmado no orçamento pelo WhatsApp."}
          </p>
          <a
            href={whatsappUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={registrarSolicitacao}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-tur-green px-6 py-3.5 text-lg font-bold uppercase tracking-wide text-tur-green-foreground transition-transform hover:scale-[1.02]"
          >
            Enviar simulação no WhatsApp
          </a>
        </div>
      )}
    </main>
  );
}
