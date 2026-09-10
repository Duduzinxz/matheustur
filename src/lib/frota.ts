import type { Tables } from "@/integrations/supabase/types";

export type Veiculo = Tables<"veiculos">;
export type KmRegistro = Tables<"km_registros">;
export type Abastecimento = Tables<"abastecimentos">;
export type Manutencao = Tables<"manutencoes">;
export type Pneu = Tables<"pneus">;
export type Despesa = Tables<"despesas">;
export type Servico = Tables<"servicos">;

export const TIPOS_VEICULO = [
  "van",
  "micro-ônibus",
  "ônibus",
  "carro",
  "utilitário",
  "outro",
] as const;

export const TIPOS_MANUTENCAO = [
  "troca de óleo",
  "filtros",
  "pneus",
  "freios",
  "suspensão",
  "bateria",
  "correias",
  "alinhamento",
  "balanceamento",
  "mecânica",
  "elétrica",
  "outros",
] as const;

export const CATEGORIAS_DESPESA = [
  "combustível",
  "manutenção",
  "pneus",
  "óleo",
  "peças",
  "oficina",
  "documentação",
  "seguro",
  "lavagem",
  "pedágio",
  "outros",
] as const;

export const POSICOES_PNEU = [
  "dianteiro esquerdo",
  "dianteiro direito",
  "traseiro esquerdo",
  "traseiro direito",
  "traseiro esquerdo interno",
  "traseiro direito interno",
  "estepe",
] as const;

export const TIPOS_SERVICO = [
  "fretamento",
  "excursão",
  "transfer",
  "escolar",
  "empresarial",
  "outro",
] as const;

export const COMBUSTIVEIS = ["diesel", "diesel S-10", "gasolina", "etanol", "GNV"] as const;

/* ---------- formatação ---------- */

export const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(v) ? v : 0);

export const km = (v: number | null | undefined) =>
  `${new Intl.NumberFormat("pt-BR").format(Math.round(v ?? 0))} km`;

export const num = (v: number, digits = 2) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(v) ? v : 0);

export function dataBR(value: string | null | undefined) {
  if (!value) return "—";
  const [y, m, d] = value.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

export const hoje = () => new Date().toISOString().slice(0, 10);

/** "2026-09" */
export const mesDe = (data: string) => data.slice(0, 7);

export function mesLabel(mes: string) {
  const [y, m] = mes.split("-");
  const nomes = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return `${nomes[Number(m) - 1] ?? m}/${y}`;
}

export function mesAtual() {
  return hoje().slice(0, 7);
}

export function ultimosMeses(qtd: number) {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < qtd; i++) {
    out.unshift(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    d.setMonth(d.getMonth() - 1);
  }
  return out;
}

/* ---------- manutenção programada (óleo) ---------- */

export type StatusManutencao = "distante" | "proxima" | "vencida" | "sem_dados";

export interface OleoInfo {
  ultimaData: string | null;
  ultimaKm: number | null;
  proximaKm: number | null;
  restante: number | null;
  status: StatusManutencao;
}

export function statusLabel(status: StatusManutencao) {
  switch (status) {
    case "vencida":
      return "🔴 Manutenção vencida";
    case "proxima":
      return "🟡 Manutenção próxima";
    case "distante":
      return "🟢 Manutenção distante";
    default:
      return "⚪ Sem registro";
  }
}

export function statusClass(status: StatusManutencao) {
  switch (status) {
    case "vencida":
      return "border-destructive/60 text-destructive";
    case "proxima":
      return "border-yellow-500/60 text-yellow-500";
    case "distante":
      return "border-tur-green/60 text-tur-green";
    default:
      return "border-border text-muted-foreground";
  }
}

/** Limite (em km) para considerar a manutenção "próxima". */
export const MARGEM_ALERTA_KM = 1000;

export function calcularOleo(
  veiculo: Veiculo,
  manutencoes: Manutencao[],
): OleoInfo {
  const trocas = manutencoes
    .filter((m) => m.veiculo_id === veiculo.id && m.tipo === "troca de óleo")
    .sort((a, b) => (a.data < b.data ? 1 : -1));
  const ultima = trocas[0];
  if (!ultima || ultima.km == null) {
    return {
      ultimaData: ultima?.data ?? null,
      ultimaKm: ultima?.km ?? null,
      proximaKm: null,
      restante: null,
      status: "sem_dados",
    };
  }
  const intervalo = veiculo.intervalo_oleo_km || 10000;
  const proximaKm = ultima.proximo_km ?? ultima.km + intervalo;
  const restante = proximaKm - veiculo.km_atual;
  const status: StatusManutencao =
    restante <= 0 ? "vencida" : restante <= MARGEM_ALERTA_KM ? "proxima" : "distante";
  return {
    ultimaData: ultima.data,
    ultimaKm: ultima.km,
    proximaKm,
    restante,
    status,
  };
}

/* ---------- pneus ---------- */

export function vidaUtilPneu(p: Pneu, veiculo?: Veiculo) {
  const fim = p.km_retirada ?? veiculo?.km_atual ?? null;
  if (fim == null) return null;
  return Math.max(fim - (p.km_instalacao ?? 0), 0);
}

export function custoPorKmPneu(p: Pneu, veiculo?: Veiculo) {
  const vida = vidaUtilPneu(p, veiculo);
  if (!vida) return null;
  const valorUnit = Number(p.valor) / Math.max(p.quantidade || 1, 1);
  return valorUnit / vida;
}

/* ---------- agregações ---------- */

export interface DadosFrota {
  veiculos: Veiculo[];
  kmRegistros: KmRegistro[];
  abastecimentos: Abastecimento[];
  manutencoes: Manutencao[];
  pneus: Pneu[];
  despesas: Despesa[];
  servicos: Servico[];
}

export interface ResumoVeiculo {
  veiculo: Veiculo;
  combustivel: number;
  manutencao: number;
  pneus: number;
  outras: number;
  despesaTotal: number;
  receita: number;
  resultado: number;
  kmRodado: number;
  litros: number;
  consumoMedio: number | null;
  custoPorKm: number | null;
}

const noMes = (data: string, mes: string | null) => (mes ? data.startsWith(mes) : true);

export function resumoVeiculo(
  dados: DadosFrota,
  veiculo: Veiculo,
  mes: string | null,
): ResumoVeiculo {
  const soma = <T,>(arr: T[], valor: (i: T) => number) =>
    arr.reduce((acc, i) => acc + valor(i), 0);

  const abast = dados.abastecimentos.filter(
    (a) => a.veiculo_id === veiculo.id && noMes(a.data, mes),
  );
  const manut = dados.manutencoes.filter(
    (m) => m.veiculo_id === veiculo.id && noMes(m.data, mes),
  );
  const pneus = dados.pneus.filter(
    (p) => p.veiculo_id === veiculo.id && noMes(p.data_instalacao, mes),
  );
  const desp = dados.despesas.filter(
    (d) => d.veiculo_id === veiculo.id && noMes(d.data, mes),
  );
  const serv = dados.servicos.filter(
    (s) => s.veiculo_id === veiculo.id && noMes(s.data, mes),
  );
  const kms = dados.kmRegistros.filter(
    (k) => k.veiculo_id === veiculo.id && noMes(k.data, mes),
  );

  const combustivel = soma(abast, (a) => Number(a.valor_total));
  const manutencao = soma(manut, (m) => Number(m.valor));
  const totalPneus = soma(pneus, (p) => Number(p.valor));
  const outras = soma(desp, (d) => Number(d.valor));
  const despesaTotal = combustivel + manutencao + totalPneus + outras;
  const receita = soma(serv, (s) => Number(s.valor));
  const litros = soma(abast, (a) => Number(a.litros));

  const kmPorRegistro = soma(kms, (k) => k.km_rodados);
  const kmPorServico = soma(serv, (s) =>
    s.km_final != null && s.km_inicial != null
      ? Math.max(s.km_final - s.km_inicial, 0)
      : 0,
  );
  const kmRodado = kmPorRegistro || kmPorServico;

  return {
    veiculo,
    combustivel,
    manutencao,
    pneus: totalPneus,
    outras,
    despesaTotal,
    receita,
    resultado: receita - despesaTotal,
    kmRodado,
    litros,
    consumoMedio: kmRodado > 0 && litros > 0 ? kmRodado / litros : null,
    custoPorKm: kmRodado > 0 ? despesaTotal / kmRodado : null,
  };
}

export interface Alerta {
  veiculoId: string;
  veiculo: string;
  nivel: "vencida" | "proxima";
  titulo: string;
  mensagem: string;
}

export function gerarAlertas(dados: DadosFrota): Alerta[] {
  const alertas: Alerta[] = [];
  for (const v of dados.veiculos) {
    if (v.status !== "ativo") continue;

    const oleo = calcularOleo(v, dados.manutencoes);
    if (oleo.restante != null) {
      if (oleo.restante <= 0) {
        alertas.push({
          veiculoId: v.id,
          veiculo: v.nome,
          nivel: "vencida",
          titulo: "Troca de óleo vencida",
          mensagem: `${v.nome} atingiu a quilometragem prevista para troca de óleo (${km(oleo.proximaKm ?? 0)}).`,
        });
      } else if (oleo.restante <= MARGEM_ALERTA_KM) {
        alertas.push({
          veiculoId: v.id,
          veiculo: v.nome,
          nivel: "proxima",
          titulo: "Troca de óleo próxima",
          mensagem: `${v.nome} está a ${km(oleo.restante)} da próxima troca de óleo.`,
        });
      }
    }

    // manutenções recorrentes com próxima km / próxima data
    for (const m of dados.manutencoes.filter((m) => m.veiculo_id === v.id)) {
      if (m.proximo_km != null && m.tipo !== "troca de óleo") {
        const restante = m.proximo_km - v.km_atual;
        if (restante <= 0) {
          alertas.push({
            veiculoId: v.id,
            veiculo: v.nome,
            nivel: "vencida",
            titulo: `Manutenção vencida — ${m.tipo}`,
            mensagem: `${v.nome} passou da km prevista (${km(m.proximo_km)}) para ${m.tipo}.`,
          });
        } else if (restante <= MARGEM_ALERTA_KM) {
          alertas.push({
            veiculoId: v.id,
            veiculo: v.nome,
            nivel: "proxima",
            titulo: `Manutenção próxima — ${m.tipo}`,
            mensagem: `${v.nome} está a ${km(restante)} da manutenção de ${m.tipo}.`,
          });
        }
      }
      if (m.proxima_data) {
        const dias = Math.ceil(
          (new Date(m.proxima_data).getTime() - Date.now()) / 86400000,
        );
        if (dias <= 0) {
          alertas.push({
            veiculoId: v.id,
            veiculo: v.nome,
            nivel: "vencida",
            titulo: `Manutenção vencida — ${m.tipo}`,
            mensagem: `${v.nome}: ${m.tipo} estava prevista para ${dataBR(m.proxima_data)}.`,
          });
        } else if (dias <= 30) {
          alertas.push({
            veiculoId: v.id,
            veiculo: v.nome,
            nivel: "proxima",
            titulo: `Manutenção próxima — ${m.tipo}`,
            mensagem: `${v.nome}: ${m.tipo} prevista para ${dataBR(m.proxima_data)} (${dias} dias).`,
          });
        }
      }
    }
  }
  return alertas.sort((a) => (a.nivel === "vencida" ? -1 : 1));
}

/** Média de despesa dos últimos meses com movimento — estimativa. */
export function previsaoMensal(dados: DadosFrota, veiculoId?: string) {
  const meses = ultimosMeses(6);
  const valores = meses.map((mes) => {
    const alvo = veiculoId
      ? dados.veiculos.filter((v) => v.id === veiculoId)
      : dados.veiculos;
    return alvo.reduce(
      (acc, v) => acc + resumoVeiculo(dados, v, mes).despesaTotal,
      0,
    );
  });
  const comMovimento = valores.filter((v) => v > 0);
  if (comMovimento.length === 0) return { media: 0, meses: 0 };
  return {
    media: comMovimento.reduce((a, b) => a + b, 0) / comMovimento.length,
    meses: comMovimento.length,
  };
}
