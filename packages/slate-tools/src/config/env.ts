import { getFileName } from "./file";
import * as path from 'path';
import * as fs from 'fs';
import { slateToolsConfig } from "../schema";

export type SlateEnv = {
  SLATE_STORE:string;
  SLATE_PASSWORD:string;
  SLATE_THEME_ID:string;
  SLATE_IGNORE_FILES?:string;
};

export const SLATE_ENV_VARS:string[] = [
  slateToolsConfig.get('env.keys.name'),
  slateToolsConfig.get('env.keys.store'),
  slateToolsConfig.get('env.keys.password'),
  slateToolsConfig.get('env.keys.themeId'),
  slateToolsConfig.get('env.keys.ignoreFiles'),
  slateToolsConfig.get('env.keys.timeout')
];

export const DEFAULT_ENV_VARS:string[] = [
  slateToolsConfig.get('env.keys.store'),
  slateToolsConfig.get('env.keys.password'),
  slateToolsConfig.get('env.keys.themeId'),
  slateToolsConfig.get('env.keys.ignoreFiles'),
];

/**
 * Returns the default slate env configuration
 */
export const getDefaultSlateEnv = () => {
  const env= {};

  DEFAULT_ENV_VARS.forEach((key) => {
    env[key] = '';
  });

  return env as SlateEnv;
}

export const setEnvName = (name?:string) => {
  let envName = name;
  const envFileName = getFileName(name);
  const envPath = path.resolve(slateToolsConfig.get('env.rootDirectory'), envFileName);

  if (typeof name === 'undefined') {
    if (fs.existsSync(envPath)) {
      envName = slateToolsConfig.get('env.defaultEnvName');
    } else {
      envName = slateToolsConfig.get('env.externalEnvName');
    }
  }

  const x = slateToolsConfig.get('env.keys.name');
  process.env[x] = envName;
}

export const getSlateEnv = () => {
  const env = {};

  SLATE_ENV_VARS.forEach((key) => {
    env[key] = process.env[key];
  });

  return env as SlateEnv;
}

export const getEmptySlateEnv = () => {
  const env = {};

  SLATE_ENV_VARS.forEach((key) => {
    env[key] = '';
  });

  return env as SlateEnv;
}