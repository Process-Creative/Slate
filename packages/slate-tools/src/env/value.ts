import { slateToolsConfig } from "../schema";

export const getEnvNameValue = () => {
  return process.env[slateToolsConfig.get('env.keys.name')];
};

// Returns the configurable environment varible that reference the store URL
export const getStoreValue = () => {
  const value = process.env[slateToolsConfig.get('env.keys.store')];
  return typeof value === 'undefined' ? '' : value;
}

export const getPasswordValue = () => {
  const value = process.env[slateToolsConfig.get('env.keys.password')];
  return typeof value === 'undefined' ? '' : value;
}

export const getThemeIdValue = () => {
  const value = process.env[slateToolsConfig.get('env.keys.themeId')];
  return typeof value === 'undefined' ? '' : value;
}

export const getIgnoreFilesValue = () => {
  const value = process.env[slateToolsConfig.get('env.keys.ignoreFiles')];
  return typeof value === 'undefined' ? '' : value;
}

export const getTimeoutValue = () => {
  const value = process.env[slateToolsConfig.get('env.keys.timeout')];
  return typeof value === 'undefined' ? '' : value;
}