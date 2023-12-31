import { MonthContract } from "./types.d.js";

export const monthsContractsDefault: Array<MonthContract> = [
  {
    month: "Enero",
    cant: 0,
  },
  {
    month: "Febrero",
    cant: 0,
  },
  {
    month: "Marzo",
    cant: 0,
  },
  {
    month: "Abril",
    cant: 0,
  },
  {
    month: "Mayo",
    cant: 0,
  },
  {
    month: "Junio",
    cant: 0,
  },
  {
    month: "Julio",
    cant: 0,
  },
  {
    month: "Agosto",
    cant: 0,
  },
  {
    month: "Septiembre",
    cant: 0,
  },
  {
    month: "Octubre",
    cant: 0,
  },
  {
    month: "Noviembre",
    cant: 0,
  },
  {
    month: "Diciembre",
    cant: 0,
  },
];

export const Months = {
  Enero: "Enero",
  Febrero: "Febrero",
  Marzo: "Marzo",
  Abril: "Abril",
  Mayo: "Mayo",
  Junio: "Junio",
  Julio: "Julio",
  Agosto: "Agosto",
  Septiembre: "Septiembre",
  Octubre: "Octubre",
  Noviembre: "Noviembre",
  Diciembre: "Diciembre",
};

export const enumMonth = Object.values(Months).map(
  (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
);
const Provinces = {
  AbraDeCaiguanab: "abra de caiguanab",
  AguaDulce: "agua dulce",
  AguasClaras: "aguas claras",
  Ahocinado: "ahocinado",
  AlonsoRojas: "alonso rojas",
  America: "américa",
  ArroyosDeMantua: "arroyos de mantua",
  BahiaHonda: "bahía honda",
  BlancaArena: "blanca arena",
  CayoLargo: "cayo largo",
  CiudadSandino: "ciudad sandino",
  Coloma: "coloma",
  ConsolacionDelNorte: "consolación del norte",
  ConsolaciónDelSur: "consolación del sur",
  Cortes: "cortés",
  Dimas: "dimas",
  Guane: "guane",
  JoseMarti: "josé martí",
  LaPalma: "la palma",
  LosPalacios: "los palacios",
  Mantua: "mantua",
  MinasDeMatahambre: "minas de matahambre",
  Ovas: "ovas",
  Pilotos: "pilotos",
  PinarDelRio: "pinar del río",
  PuertaDeGolpe: "puerta de golpe",
  SanCristóbal: "san cristóbal",
  SanDiegoDeLosBaños: "san diego de los baños",
  Sandino: "sandino",
  SanJuanYMartínez: "san juan y martínez",
  SanJulian: "san julián",
  SanLuis: "san luis",
  SantaCruzDeLosPinos: "santa cruz de los pinos",
  Villamil: "villamil",
  Viñales: "viñales",
};
