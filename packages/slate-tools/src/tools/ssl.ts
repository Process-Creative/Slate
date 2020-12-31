import { readFileSync, existsSync } from 'fs';
import * as path from 'path';
import SlateConfig from '@process-creative/slate-config';

const config = new SlateConfig(require('../slate-tools.schema'));

export const sslKeyCert = () => {
  const key = readFileSync(getSSLKeyPath());
  const cert = readFileSync(getSSLCertPath());

  return { key, cert };
}

export const getSSLKeyPath = ():string => {
  return existsSync(config.get('ssl.key'))
    ? config.get('ssl.key')
    : path.join(__dirname, '..', '..', './server.pem')
  ;
}

export const getSSLCertPath = ():string => {
  return existsSync(config.get('ssl.cert'))
    ? config.get('ssl.cert')
    : path.join(__dirname, '..', '..', './server.pem')
  ;
}