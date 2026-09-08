import { useMemo, useRef, useState } from "react";
import { CITIES, getStateStyle, type City } from "@/lib/cities";

interface Props {
  label: string;
  hint?: string;
  value: City | null;
  onChange: (city: City | null) => void;
  excludeUba?: boolean;
}

export function CitySelect({
  label,
  hint,
  value,
  onChange,
  excludeUba,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = excludeUba
      ? CITIES.filter(
          (c) => !(c.uf === "MG" && c.name.toLowerCase().startsWith("ubá")),
        )
      : CITIES;
    if (!q) {
      // Sem busca: prioriza Minas Gerais, depois estados vizinhos
      const mg = pool.filter((c) => c.uf === "MG");
      const neighbors = pool.filter((c) => ["SP", "RJ", "ES"].includes(c.uf));
      return [...mg, ...neighbors].slice(0, 12);
    }
    const matches = pool.filter((c) =>
      `${c.name} ${c.uf}`.toLowerCase().includes(q),
    );
    // Ordena: MG primeiro, depois SP/RJ/ES, depois resto
    const order = ["MG", "SP", "RJ", "ES"];
    return matches
      .sort((a, b) => {
        const idxA = order.indexOf(a.uf);
        const idxB = order.indexOf(b.uf);
        if (idxA === -1 && idxB === -1) return a.name.localeCompare(b.name);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB || a.name.localeCompare(b.name);
      })
      .slice(0, 10);
  }, [query, excludeUba]);

  const selectedStyle = value ? getStateStyle(value.uf) : null;

  return (
    <div className="relative" ref={boxRef}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {value ? (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left transition-opacity hover:opacity-80"
          style={{
            backgroundColor: selectedStyle?.surface,
            borderColor: selectedStyle?.border,
          }}
        >
          <span className="font-semibold">
            {value.name}{" "}
            <span className="font-bold" style={{ color: selectedStyle?.color }}>
              — {value.uf}
            </span>
          </span>
          <span className="text-sm text-muted-foreground underline-offset-2">
            trocar
          </span>
        </button>
      ) : (
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Digite a cidade…"
          className="w-full rounded-md border border-input bg-secondary px-3 py-2.5 text-foreground outline-none placeholder:text-muted-foreground focus:border-tur-green"
        />
      )}
      {hint && !value && (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      )}
      {open && !value && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-popover shadow-xl">
          {results.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Nenhuma cidade encontrada
            </li>
          )}
          {results.map((c) => {
            const style = getStateStyle(c.uf);
            return (
              <li key={`${c.name}-${c.uf}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(c);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <span>{c.name}</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: style.color }}
                  >
                    {c.uf}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
