import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DadosFrota } from "@/lib/frota";

async function fetchFrota(): Promise<DadosFrota> {
  const [veiculos, kmRegistros, abastecimentos, manutencoes, pneus, despesas, servicos] =
    await Promise.all([
      supabase.from("veiculos").select("*").order("nome"),
      supabase.from("km_registros").select("*").order("data", { ascending: false }),
      supabase.from("abastecimentos").select("*").order("data", { ascending: false }),
      supabase.from("manutencoes").select("*").order("data", { ascending: false }),
      supabase.from("pneus").select("*").order("data_instalacao", { ascending: false }),
      supabase.from("despesas").select("*").order("data", { ascending: false }),
      supabase.from("servicos").select("*").order("data", { ascending: false }),
    ]);

  const erro =
    veiculos.error ||
    kmRegistros.error ||
    abastecimentos.error ||
    manutencoes.error ||
    pneus.error ||
    despesas.error ||
    servicos.error;
  if (erro) throw erro;

  return {
    veiculos: veiculos.data ?? [],
    kmRegistros: kmRegistros.data ?? [],
    abastecimentos: abastecimentos.data ?? [],
    manutencoes: manutencoes.data ?? [],
    pneus: pneus.data ?? [],
    despesas: despesas.data ?? [],
    servicos: servicos.data ?? [],
  };
}

export const FROTA_KEY = ["frota"] as const;

export function useFrota() {
  return useQuery({ queryKey: FROTA_KEY, queryFn: fetchFrota });
}

export function useRecarregarFrota() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: FROTA_KEY });
}
