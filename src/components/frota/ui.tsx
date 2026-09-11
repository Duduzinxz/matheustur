import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Veiculo } from "@/lib/frota";

export const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-tur-green";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-md bg-tur-green px-4 py-2 text-sm font-bold uppercase tracking-wide text-tur-green-foreground transition-transform hover:scale-[1.03] disabled:opacity-60";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground";

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "green" | "red" | "yellow";
}) {
  const toneCls =
    tone === "green"
      ? "text-tur-green"
      : tone === "red"
        ? "text-destructive"
        : tone === "yellow"
          ? "text-yellow-500"
          : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-2 text-2xl font-bold", toneCls)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[36rem] text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "border-b border-border px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <td className={cn("border-b border-border/60 px-3 py-2", className)}>{children}</td>
  );
}

export function Vazio({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function VeiculoSelect({
  veiculos,
  value,
  onChange,
  incluirTodos,
}: {
  veiculos: Veiculo[];
  value: string;
  onChange: (v: string) => void;
  incluirTodos?: boolean;
}) {
  return (
    <select
      className={inputCls}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Veículo"
    >
      {incluirTodos && <option value="">Todos os veículos</option>}
      {veiculos.map((v) => (
        <option key={v.id} value={v.id}>
          {v.nome}
          {v.placa ? ` — ${v.placa}` : ""}
        </option>
      ))}
    </select>
  );
}
