import { Omit, Unionize } from 'utility-types';
import * as fs from 'fs';
import * as path from 'path';
import { SlateSchema } from './schema';

// Slate Load the Users' custom configuration
type SlateConfigGetUserParams = { slateConfigPath:string; };
const slateConfigGetUser = <T>(params:SlateConfigGetUserParams):T|null => {
  let { slateConfigPath } = (params||{});

  if (fs.existsSync(slateConfigPath)) {
    return require(slateConfigPath);
  }

  return null;
}

export type SlateConfig<T, K1 extends keyof T = keyof T> = {
  get:<K extends K1>(key:K)=>T[K];
}

export const slateConfigCreate = <T>(schema:SlateSchema<T>) => {
  type S = SlateSchema<T>;

  //Setup a shorthand getter
  const getValue = <K extends keyof T>(
    list:Partial<S>, key:K, defaultValue?:T[K]
  ):T[K] => {
    const v = list[key as keyof S] as unknown;
    return typeof v === 'function' ? v(defaultValue) : v;
  }

  // Create the config instance first.
  const config:SlateConfig<T> = {
    get: <K extends keyof T>(key:K) => {

      // Start by loading the default
      const defaultValue = getValue(schemaDefaults, key);
      if (typeof defaultValue === typeof undefined) {
        throw new Error(
          `[slate-config]: A value has not been defined for the key '${key}'`,
        );
      }
      // Check for user override and supply the default
      if(schemaUser) {
        const userValue = getValue(schemaUser, key, defaultValue);
        if(typeof userValue !== typeof undefined) return userValue;
      }
      return defaultValue;
    }
  };

  // Load in the defaults
  const schemaDefaults = { ...schema(config) };

  // Load in the users' config
  let schemaUser:Partial<S>|null = null;
  [
    'slate.config.ts',
    'slate.config.js'
  ].find(p => {
    schemaUser = slateConfigGetUser<SlateSchema<T>>({
      slateConfigPath: path.resolve('.', p)
    });
    return schemaUser;
  });

  // Return the created config
  return config;
}