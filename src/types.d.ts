import { ObjectId, Schema } from "mongoose";
import { Months } from "./const.js";

export enum States {
  AbraDeCaiguanab = "abra de caiguanab",
  AguaDulce = "agua dulce",
  AguasClaras = "aguas claras",
  Ahocinado = "ahocinado",
  AlonsoRojas = "alonso rojas",
  America = "américa",
  ArroyosDeMantua = "arroyos de mantua",
  BahiaHonda = "bahía honda",
  BlancaArena = "blanca arena",
  CayoLargo = "cayo largo",
  CiudadSandino = "ciudad sandino",
  Coloma = "coloma",
  ConsolacionDelNorte = "consolación del norte",
  ConsolaciónDelSur = "consolación del sur",
  Cortes = "cortés",
  Dimas = "dimas",
  Guane = "guane",
  JoseMarti = "josé martí",
  LaPalma = "la palma",
  LosPalacios = "los palacios",
  Mantua = "mantua",
  MinasDeMatahambre = "minas de matahambre",
  Ovas = "ovas",
  Pilotos = "pilotos",
  PinarDelRio = "pinar del río",
  PuertaDeGolpe = "puerta de golpe",
  SanCristobal = "san cristóbal",
  SanDiegoDeLosBaños = "san diego de los baños",
  Sandino = "sandino",
  SanJuanYMartinez = "san juan y martínez",
  SanJulian = "san julián",
  SanLuis = "san luis",
  SantaCruzDeLosPinos = "santa cruz de los pinos",
  Villamil = "villamil",
  Vinales = "viñales",
}

export interface Commom {
  name: string;
}

export type Address = {
  address: string;
};

export enum Role {
  Specialist = "specialist",
  Admin = "admin",
}

export type Month = keyof typeof Months;

// type Provinces = typeof Object.values(Provinces);

export type Province = Commom & {};

export type State = Commom & {
  province: Schema.Types.ObjectId;
};

export type Route = Commom & {};

export type Tank = Commom &
  Address & {
    capacity: number;
    state: Schema.Types.ObjectId;
    routes: [Schema.Types.ObjectId];
  };

export type ProductiveBase = Commom &
  Address & {
    state: Schema.Types.ObjectId;
    route: Schema.Types.ObjectId;
  };

export type MonthContract = {
  month: Month;
  cant: number;
};

export type Producer = {
  firstname: string;
  secondname?: string;
  surename: string;
  second_surename?: string;
  age: number;
  phone_number: string;
  productive_base: Schema.Types.ObjectId;
  ci: string;
  months_contracts?: Array<MonthContract>;
  cant_animals?: number;
};

export type Report = {
  type_milk: MilkType.hot | MilkType.cold;
  dayli_collect: Number;
  producer: Schema.Types.ObjectId;
  productive_base: Schema.Types.ObjectId;
};

export type User =
  | {
      firstname: string;
      secondname?: string;
      surename: string;
      second_surename?: string;
      username: string;
      password: string;
    } & (
      | {
          role: Role.Specialist;
          productiveBaseInCharge: Schema.Types.ObjectId;
        }
      | {
          role: Role.Admin;
        }
    );

export enum Routes {
  producers = "/producer",
  tanks = "/tank",
  routes = "/route",
  productiveBases = "/productive-base",
  province = "/province",
  state = "/state",
  report = "/report",
  auth = "/auth",
}

export enum MilkType {
  hot = "hot",
  cold = "cold",
}

type Payload = {
  role: Role;
  uid: string;
  productiveBaseInCharge?: string;
};
