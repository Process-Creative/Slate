import { readFileSync, existsSync } from 'fs';
import * as path from 'path';
import { slateToolsConfig } from '../schema';

export type SSLKeyCert = {
  key: Buffer;
  cert: Buffer;
}

export const sslKeyCert = (): SSLKeyCert => {
  const key = readFileSync(getSSLKeyPath());
  const cert = readFileSync(getSSLCertPath());

  return { key, cert };
}

export const getSSLKeyPath = ():string => {
  return existsSync(slateToolsConfig.get('ssl.key'))
    ? slateToolsConfig.get('ssl.key')
    : path.join(__dirname, '..', '..', './server.pem')
  ;
}

export const getSSLCertPath = ():string => {
  return existsSync(slateToolsConfig.get('ssl.cert'))
    ? slateToolsConfig.get('ssl.cert')
    : path.join(__dirname, '..', '..', './server.pem')
  ;
}