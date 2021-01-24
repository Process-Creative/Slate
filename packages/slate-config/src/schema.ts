import { SlateConfig } from "./config";


type SlateSchemaDefinition<T,K1 extends keyof T=keyof T> = {
  [K in K1]:T[K] | ((defaultValue:T[K])=>T[K]);
};

export type SlateSchema<T> = (config:SlateConfig<T>)=>SlateSchemaDefinition<T>;
export const slateSchemaCreate = <T>(config:SlateSchema<T>)=>config;