import { getDefaultSlateEnv } from "./env";
import * as path from 'path';
import { slateToolsConfig } from "../schema";

/**
 * Return the default env file name, with optional name appended
 * @param name env file name
 */
export const getFileName = (name?:string):string => {
  if (typeof name === 'undefined' || name.trim() === '') {
    return slateToolsConfig.get('env.basename');
  }
  return `${slateToolsConfig.get('env.basename')}.${name}`;
}

/**
 * Return the file path of the env file
 * @param name name of the env file
 */
export const getFilePath = (name?:string) => {
  const envFileName = getFileName(name);
  const envPath = path.resolve(slateToolsConfig.get('env.rootDirectory'), envFileName);
  return envPath;
}

/**
 * Return default list of env variables with their assigned value, if any.
 * @param values 
 */
export const getFileContents = (values?:string[]) => {
  const env = getDefaultSlateEnv();

  if(values) {
    for (const key in values) {
      if (values.hasOwnProperty(key) && env.hasOwnProperty(key)) {
        env[key] = values[key];
      }
    }
  }

  return Object.entries(env)
    .map(kvp => kvp.join('='))
    .join('\r\n')
  ;
}