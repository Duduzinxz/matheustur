export interface City {
  name: string;
  uf: string;
  lat: number;
  lng: number;
}

// Ponto fixo: garagem da Matheus Tur em Ubá - MG
export const GARAGE: City = {
  name: "Ubá",
  uf: "MG",
  lat: -21.1201,
  lng: -42.9428,
};

export const STATE_COLORS = {
  MG: "state-mg",
  SP: "state-sp",
  RJ: "state-rj",
  ES: "state-es",
} as const;

export function getStateColor(uf: string): string {
  return STATE_COLORS[uf as keyof typeof STATE_COLORS] ?? "silver";
}

export function getStateStyle(uf: string) {
  const color = getStateColor(uf);
  return {
    color: `var(--${color})`,
    foreground: `var(--${color}-foreground)`,
    surface: `color-mix(in oklab, var(--${color}) 10%, transparent)`,
    border: `color-mix(in oklab, var(--${color}) 40%, transparent)`,
    softBorder: `color-mix(in oklab, var(--${color}) 30%, transparent)`,
    dot: `var(--${color})`,
  };
}

// Cidades com foco em Minas Gerais + estados vizinhos (SP, RJ, ES) + principais destinos nacionais
export const CITIES: City[] = [
  // Zona da Mata / região de Ubá
  { name: "Ubá", uf: "MG", lat: -21.1201, lng: -42.9428 },
  { name: "Juiz de Fora", uf: "MG", lat: -21.7642, lng: -43.3496 },
  { name: "Muriaé", uf: "MG", lat: -21.1305, lng: -42.3664 },
  { name: "Cataguases", uf: "MG", lat: -21.3897, lng: -42.6967 },
  { name: "Leopoldina", uf: "MG", lat: -21.5319, lng: -42.6431 },
  { name: "Além Paraíba", uf: "MG", lat: -21.8878, lng: -42.7044 },
  { name: "Santos Dumont", uf: "MG", lat: -21.4558, lng: -43.5528 },
  { name: "Ponte Nova", uf: "MG", lat: -20.4164, lng: -42.9086 },
  { name: "Manhuaçu", uf: "MG", lat: -20.2581, lng: -42.0336 },
  { name: "Carangola", uf: "MG", lat: -20.2406, lng: -42.0294 },
  { name: "Viçosa", uf: "MG", lat: -20.7539, lng: -42.8819 },
  { name: "Ubaporanga", uf: "MG", lat: -20.7358, lng: -42.8389 },
  { name: "São João Nepomuceno", uf: "MG", lat: -21.54, lng: -43.0097 },
  { name: "Bicas", uf: "MG", lat: -21.7253, lng: -43.0594 },
  { name: "Mar de Espanha", uf: "MG", lat: -21.8669, lng: -43.0103 },
  { name: "Tocantins", uf: "MG", lat: -21.175, lng: -43.0181 },
  { name: "Rio Novo", uf: "MG", lat: -21.4589, lng: -43.1244 },
  { name: "Astolfo Dutra", uf: "MG", lat: -21.3158, lng: -42.8619 },
  { name: "Divinésia", uf: "MG", lat: -20.9906, lng: -43.0053 },
  { name: "Guiricema", uf: "MG", lat: -21.0078, lng: -42.7181 },
  { name: "Visconde do Rio Branco", uf: "MG", lat: -21.0097, lng: -42.8406 },
  { name: "São Francisco do Glória", uf: "MG", lat: -20.7889, lng: -42.2669 },
  { name: "Ervália", uf: "MG", lat: -20.8397, lng: -42.6569 },
  { name: "Mirai", uf: "MG", lat: -21.1953, lng: -42.6139 },
  { name: "Fervedouro", uf: "MG", lat: -20.7261, lng: -42.2789 },
  { name: "Teixeiras", uf: "MG", lat: -20.6522, lng: -42.8558 },
  { name: "Rio Pomba", uf: "MG", lat: -21.275, lng: -43.1778 },
  { name: "Mercês", uf: "MG", lat: -21.1939, lng: -43.3403 },
  { name: "Guarará", uf: "MG", lat: -21.73, lng: -43.0369 },
  { name: "Ubá (centro)", uf: "MG", lat: -21.1201, lng: -42.9428 },
  // Restante de Minas Gerais
  { name: "Belo Horizonte", uf: "MG", lat: -19.9167, lng: -43.9345 },
  { name: "Contagem", uf: "MG", lat: -19.9317, lng: -44.0536 },
  { name: "Betim", uf: "MG", lat: -19.9678, lng: -44.1983 },
  { name: "Uberlândia", uf: "MG", lat: -18.9186, lng: -48.2772 },
  { name: "Uberaba", uf: "MG", lat: -19.7483, lng: -47.9319 },
  { name: "Montes Claros", uf: "MG", lat: -16.735, lng: -43.8617 },
  { name: "Governador Valadares", uf: "MG", lat: -18.8511, lng: -41.9494 },
  { name: "Teófilo Otoni", uf: "MG", lat: -17.8575, lng: -41.5053 },
  { name: "Ipatinga", uf: "MG", lat: -19.4683, lng: -42.5367 },
  { name: "Coronel Fabriciano", uf: "MG", lat: -19.5189, lng: -42.6289 },
  { name: "Timóteo", uf: "MG", lat: -19.5828, lng: -42.6494 },
  { name: "Itabira", uf: "MG", lat: -19.6192, lng: -43.2269 },
  { name: "Conselheiro Lafaiete", uf: "MG", lat: -20.6603, lng: -43.7861 },
  { name: "Barbacena", uf: "MG", lat: -21.2258, lng: -43.7736 },
  { name: "São João del-Rei", uf: "MG", lat: -21.1356, lng: -44.2617 },
  { name: "Ouro Preto", uf: "MG", lat: -20.3856, lng: -43.5033 },
  { name: "Mariana", uf: "MG", lat: -20.3778, lng: -43.4161 },
  { name: "Divinópolis", uf: "MG", lat: -20.1389, lng: -44.8842 },
  { name: "Itaúna", uf: "MG", lat: -20.0753, lng: -44.5764 },
  { name: "Sete Lagoas", uf: "MG", lat: -19.4658, lng: -44.2467 },
  { name: "Poços de Caldas", uf: "MG", lat: -21.7878, lng: -46.5608 },
  { name: "Pouso Alegre", uf: "MG", lat: -22.23, lng: -45.9364 },
  { name: "Varginha", uf: "MG", lat: -21.5517, lng: -45.43 },
  { name: "Três Corações", uf: "MG", lat: -21.6969, lng: -45.2533 },
  { name: "Lavras", uf: "MG", lat: -21.2453, lng: -44.9997 },
  { name: "Passos", uf: "MG", lat: -20.7189, lng: -46.6097 },
  { name: "Patos de Minas", uf: "MG", lat: -18.5789, lng: -46.5181 },
  { name: "Araxá", uf: "MG", lat: -19.5933, lng: -46.9406 },
  { name: "Ituiutaba", uf: "MG", lat: -18.9692, lng: -49.4639 },
  { name: "Paracatu", uf: "MG", lat: -17.2222, lng: -46.875 },
  { name: "Januária", uf: "MG", lat: -15.4853, lng: -44.3619 },
  { name: "Pirapora", uf: "MG", lat: -17.345, lng: -44.9419 },
  { name: "Diamantina", uf: "MG", lat: -18.2414, lng: -43.6036 },
  { name: "Capelinha", uf: "MG", lat: -17.6914, lng: -42.5158 },
  { name: "Araçuaí", uf: "MG", lat: -16.8497, lng: -42.0703 },
  { name: "Almenara", uf: "MG", lat: -16.1836, lng: -40.6944 },
  { name: "Caratinga", uf: "MG", lat: -19.7903, lng: -42.1392 },
  { name: "Manhumirim", uf: "MG", lat: -20.3578, lng: -41.9583 },
  { name: "Aimorés", uf: "MG", lat: -19.4958, lng: -41.0639 },
  { name: "Nanuque", uf: "MG", lat: -17.8392, lng: -40.3539 },
  { name: "São Lourenço", uf: "MG", lat: -22.1164, lng: -45.0542 },
  { name: "Caxambu", uf: "MG", lat: -21.9772, lng: -44.9325 },
  { name: "Itajubá", uf: "MG", lat: -22.4256, lng: -45.4528 },
  { name: "Três Pontas", uf: "MG", lat: -21.3669, lng: -45.5125 },
  { name: "Alfenas", uf: "MG", lat: -21.4292, lng: -45.9472 },
  { name: "Nova Lima", uf: "MG", lat: -19.9858, lng: -43.8467 },
  { name: "Sabará", uf: "MG", lat: -19.8858, lng: -43.8069 },
  { name: "Santa Luzia", uf: "MG", lat: -19.7697, lng: -43.8514 },
  { name: "Curvelo", uf: "MG", lat: -18.7564, lng: -44.4308 },
  { name: "Bom Despacho", uf: "MG", lat: -19.7361, lng: -45.2522 },
  { name: "Formiga", uf: "MG", lat: -20.4644, lng: -45.4264 },
  { name: "Pará de Minas", uf: "MG", lat: -19.8603, lng: -44.6083 },
  { name: "João Monlevade", uf: "MG", lat: -19.8097, lng: -43.1733 },
  { name: "Nova Era", uf: "MG", lat: -19.75, lng: -43.0375 },
  // São Paulo
  { name: "São Paulo", uf: "SP", lat: -23.5505, lng: -46.6333 },
  { name: "Campinas", uf: "SP", lat: -22.9099, lng: -47.0626 },
  { name: "Guarulhos", uf: "SP", lat: -23.4538, lng: -46.5333 },
  { name: "Aparecida", uf: "SP", lat: -22.8469, lng: -45.2297 },
  { name: "Campos do Jordão", uf: "SP", lat: -22.7396, lng: -45.5914 },
  { name: "São José dos Campos", uf: "SP", lat: -23.2237, lng: -45.9009 },
  { name: "Sorocaba", uf: "SP", lat: -23.5015, lng: -47.4586 },
  { name: "Jundiaí", uf: "SP", lat: -23.1857, lng: -46.8978 },
  { name: "Santos", uf: "SP", lat: -23.9618, lng: -46.3322 },
  { name: "Praia Grande", uf: "SP", lat: -24.0084, lng: -46.4125 },
  { name: "São Vicente", uf: "SP", lat: -23.9631, lng: -46.3915 },
  { name: "Guarujá", uf: "SP", lat: -23.9933, lng: -46.2564 },
  { name: "Ubatuba", uf: "SP", lat: -23.4332, lng: -45.1325 },
  { name: "Caraguatatuba", uf: "SP", lat: -23.6203, lng: -45.4131 },
  { name: "Ilhabela", uf: "SP", lat: -23.7788, lng: -45.3587 },
  { name: "Taubaté", uf: "SP", lat: -23.0264, lng: -45.5553 },
  { name: "Pindamonhangaba", uf: "SP", lat: -22.9244, lng: -45.4617 },
  { name: "Vale do Paraíba", uf: "SP", lat: -23.0294, lng: -45.5558 },
  { name: "São Sebastião", uf: "SP", lat: -23.79, lng: -45.4017 },
  { name: "Ribeirão Preto", uf: "SP", lat: -21.1699, lng: -47.8099 },
  { name: "São Carlos", uf: "SP", lat: -22.0087, lng: -47.8909 },
  { name: "Araraquara", uf: "SP", lat: -21.7848, lng: -48.1786 },
  { name: "Bauru", uf: "SP", lat: -22.3145, lng: -49.0587 },
  { name: "Marília", uf: "SP", lat: -22.2139, lng: -49.9459 },
  { name: "Presidente Prudente", uf: "SP", lat: -22.1256, lng: -51.3889 },
  { name: "Araçatuba", uf: "SP", lat: -21.2087, lng: -50.4328 },
  { name: "São José do Rio Preto", uf: "SP", lat: -20.8118, lng: -49.3762 },
  { name: "Barretos", uf: "SP", lat: -20.5574, lng: -48.5677 },
  { name: "Franca", uf: "SP", lat: -20.5386, lng: -47.4009 },
  { name: "Americana", uf: "SP", lat: -22.7394, lng: -47.3314 },
  { name: "Limeira", uf: "SP", lat: -22.5647, lng: -47.4017 },
  { name: "Piracicaba", uf: "SP", lat: -22.7343, lng: -47.6481 },
  { name: "São João da Boa Vista", uf: "SP", lat: -21.9696, lng: -46.7981 },
  { name: "Poços de Caldas", uf: "SP", lat: -21.7878, lng: -46.5608 },
  { name: "Águas de Lindóia", uf: "SP", lat: -22.4764, lng: -46.6325 },
  { name: "Serra Negra", uf: "SP", lat: -22.6122, lng: -46.7006 },
  { name: "Socorro", uf: "SP", lat: -22.5883, lng: -46.5289 },
  { name: "Holambra", uf: "SP", lat: -22.6372, lng: -47.0478 },
  { name: "Atibaia", uf: "SP", lat: -23.1169, lng: -46.5503 },
  { name: "Bragança Paulista", uf: "SP", lat: -22.9531, lng: -46.5422 },
  // Rio de Janeiro
  { name: "Rio de Janeiro", uf: "RJ", lat: -22.9068, lng: -43.1729 },
  { name: "Petrópolis", uf: "RJ", lat: -22.5112, lng: -43.1779 },
  { name: "Nova Friburgo", uf: "RJ", lat: -22.2932, lng: -42.5308 },
  { name: "Campos dos Goytacazes", uf: "RJ", lat: -21.7545, lng: -41.3244 },
  { name: "Cabo Frio", uf: "RJ", lat: -22.8794, lng: -42.0189 },
  { name: "Búzios", uf: "RJ", lat: -22.7469, lng: -41.8819 },
  { name: "Niterói", uf: "RJ", lat: -22.8833, lng: -43.1036 },
  { name: "São Gonçalo", uf: "RJ", lat: -22.8197, lng: -43.0536 },
  { name: "Duque de Caxias", uf: "RJ", lat: -22.7868, lng: -43.3131 },
  { name: "Nova Iguaçu", uf: "RJ", lat: -22.7592, lng: -43.4511 },
  { name: "Angra dos Reis", uf: "RJ", lat: -23.0069, lng: -44.3181 },
  { name: "Paraty", uf: "RJ", lat: -23.2178, lng: -44.7131 },
  { name: "Resende", uf: "RJ", lat: -22.4684, lng: -44.4463 },
  { name: "Volta Redonda", uf: "RJ", lat: -22.5232, lng: -44.1043 },
  { name: "Barra Mansa", uf: "RJ", lat: -22.5444, lng: -44.1714 },
  { name: "Teresópolis", uf: "RJ", lat: -22.4166, lng: -42.9757 },
  { name: "Magé", uf: "RJ", lat: -22.6525, lng: -43.0411 },
  { name: "Itaboraí", uf: "RJ", lat: -22.7444, lng: -42.8589 },
  { name: "Maricá", uf: "RJ", lat: -22.9194, lng: -42.8186 },
  { name: "Saquarema", uf: "RJ", lat: -22.92, lng: -42.5103 },
  { name: "Arraial do Cabo", uf: "RJ", lat: -22.9664, lng: -42.0278 },
  { name: "Macaé", uf: "RJ", lat: -22.3708, lng: -41.7868 },
  { name: "Casimiro de Abreu", uf: "RJ", lat: -22.4806, lng: -42.2042 },
  { name: "Silva Jardim", uf: "RJ", lat: -22.6508, lng: -42.3917 },
  // Espírito Santo
  { name: "Vitória", uf: "ES", lat: -20.3155, lng: -40.3128 },
  { name: "Vila Velha", uf: "ES", lat: -20.3297, lng: -40.2925 },
  { name: "Guarapari", uf: "ES", lat: -20.6711, lng: -40.4986 },
  { name: "Linhares", uf: "ES", lat: -19.3911, lng: -40.0722 },
  { name: "Serra", uf: "ES", lat: -20.1219, lng: -40.3081 },
  { name: "Cariacica", uf: "ES", lat: -20.2636, lng: -40.4208 },
  { name: "Cachoeiro de Itapemirim", uf: "ES", lat: -20.8486, lng: -41.1129 },
  { name: "Colatina", uf: "ES", lat: -19.5386, lng: -40.6308 },
  { name: "São Mateus", uf: "ES", lat: -18.7167, lng: -39.8583 },
  { name: "Aracruz", uf: "ES", lat: -19.8203, lng: -40.2764 },
  { name: "Viana", uf: "ES", lat: -20.3903, lng: -40.4931 },
  { name: "Domingos Martins", uf: "ES", lat: -20.3633, lng: -40.6592 },
  { name: "Marechal Floriano", uf: "ES", lat: -20.415, lng: -40.6692 },
  { name: "Santa Teresa", uf: "ES", lat: -19.9328, lng: -40.6008 },
  { name: "Iúna", uf: "ES", lat: -20.3539, lng: -41.5331 },
  { name: "Ibiracu", uf: "ES", lat: -19.8317, lng: -40.3739 },
  { name: "Fundão", uf: "ES", lat: -19.9331, lng: -40.4058 },
  { name: "Alfredo Chaves", uf: "ES", lat: -20.635, lng: -40.7497 },
  { name: "Iconha", uf: "ES", lat: -20.7914, lng: -40.8111 },
  { name: "Vargem Alta", uf: "ES", lat: -20.6714, lng: -41.0208 },
  { name: "Piúma", uf: "ES", lat: -20.8375, lng: -40.7214 },
  { name: "Marataízes", uf: "ES", lat: -21.0433, lng: -40.8236 },
  { name: "Itapemirim", uf: "ES", lat: -21.0111, lng: -40.8303 },
  { name: "Castelo", uf: "ES", lat: -20.6033, lng: -41.2031 },
  { name: "Anchieta", uf: "ES", lat: -20.795, lng: -40.6525 },
  // Principais destinos fora da região sudeste
  { name: "Brasília", uf: "DF", lat: -15.7939, lng: -47.8828 },
  { name: "Salvador", uf: "BA", lat: -12.9777, lng: -38.5016 },
  { name: "Porto Seguro", uf: "BA", lat: -16.4436, lng: -39.0647 },
  { name: "Ilhéus", uf: "BA", lat: -14.7889, lng: -39.0494 },
  { name: "Goiânia", uf: "GO", lat: -16.6869, lng: -49.2648 },
  { name: "Caldas Novas", uf: "GO", lat: -17.7444, lng: -48.6278 },
  { name: "Belém", uf: "PA", lat: -1.4558, lng: -48.4902 },
  { name: "Curitiba", uf: "PR", lat: -25.4284, lng: -49.2733 },
  { name: "Balneário Camboriú", uf: "SC", lat: -26.9928, lng: -48.635 },
];

// Fator de correção rodoviária (linha reta -> estrada)
export const ROAD_FACTOR = 1.28;

export function haversineKm(a: City, b: City): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function roadKm(a: City, b: City): number {
  return Math.round(haversineKm(a, b) * ROAD_FACTOR);
}

export function isUba(city: City): boolean {
  return city.uf === "MG" && city.name.toLowerCase().startsWith("ubá");
}
