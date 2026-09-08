import { getStateStyle } from "@/lib/cities";
import { Reveal } from "@/components/Reveal";
import { StateShape } from "@/components/StateShape";

const STATES = [
  {
    uf: "MG" as const,
    name: "Minas Gerais",
    text: "Nossa base — Ubá e toda a Zona da Mata e região.",
  },
  {
    uf: "SP" as const,
    name: "São Paulo",
    text: "Capital e interior, para negócios ou turismo.",
  },
  {
    uf: "RJ" as const,
    name: "Rio de Janeiro",
    text: "Capital, litoral e serra fluminense.",
  },
  {
    uf: "ES" as const,
    name: "Espírito Santo",
    text: "Litoral capixaba e cidades do interior.",
  },
];

export function DestinationsSection() {
  return (
    <section id="destinos" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-tur-green">
            Onde atuamos
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
            Saindo de Ubá, levamos você aos principais destinos do Sudeste.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATES.map((s, i) => {
            const style = getStateStyle(s.uf);
            return (
              <Reveal key={s.uf} delay={i * 90}>
                <div
                  className="group relative h-full overflow-hidden rounded-lg border p-6 transition-transform hover:-translate-y-1"
                  style={{
                    borderColor: style.border,
                    backgroundColor: style.surface,
                  }}
                >
                  <StateShape
                    uf={s.uf}
                    color={style.color}
                    className="absolute -right-4 -top-4 h-24 w-auto opacity-[0.14] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-20"
                  />
                  <div className="relative flex items-center justify-between">
                    <StateShape
                      uf={s.uf}
                      color={style.color}
                      className="h-11 w-auto drop-shadow-sm"
                    />
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: style.color }}
                    >
                      {s.uf}
                    </span>
                  </div>
                  <h3
                    className="relative mt-5 text-lg font-bold uppercase tracking-wide"
                    style={{ color: style.color }}
                  >
                    {s.name}
                  </h3>
                  <p className="relative mt-2 text-sm text-muted-foreground">
                    {s.text}
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
