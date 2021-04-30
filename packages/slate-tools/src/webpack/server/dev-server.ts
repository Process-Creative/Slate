import browserSync, { BrowserSyncInstance } from 'browser-sync';
import { getSSLKeyPath, getSSLCertPath } from '../../utils/ssl';
import { Request, Response, NextFunction } from 'express';
import { getStoreValue, getThemeIdValue } from '../../env/value';

type DevServerOptions = {
  port:number;
  address:string;
  uiPort:number;
}

export class DevServer {
  public bs:BrowserSyncInstance;
  public target:string;
  public themeId:string;
  public port:number;
  public address:string;
  public uiPort:number;
  public proxyTarget:string;

  public server:any|undefined;

  constructor(options:DevServerOptions) {
    this.bs = browserSync.create();
    this.target = `https://${getStoreValue()}`;
    this.themeId = getThemeIdValue();
    this.port = options.port;
    this.address = options.address;
    this.uiPort = options.uiPort;
    this.proxyTarget =
      this.target +
      (this.themeId === 'live' ? '' : `?preview_theme_id=${this.themeId}`)
    ;
  }

  start() {
    const bsConfig = {
      port: this.port,
      open: false,
      notify: false,
      reloadOnRestart: true,
      proxy: {
        target: this.proxyTarget,
        middleware: (req: Request, res: Response, next: NextFunction) => {
          // Shopify sites with redirection enabled for custom domains force redirection
          // to that domain. `?_fd=0` prevents that forwarding.
          // ?pb=0 hides the Shopify preview bar
          const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
          const queryStringComponents = ['_fd=0&pb=0'];

          req.url += prefix + queryStringComponents.join('&');
          next();
        },
        proxyRes: [
          function(proxyRes: Response & { headers: { [key: string]: any } }) {
            // disable HSTS. Slate might force us to use HTTPS but having HSTS on local dev makes it impossible to do other non-Slate dev.
            delete proxyRes.headers['strict-transport-security'];
          },
        ],
      },
      https: {key: getSSLKeyPath(), cert: getSSLCertPath()},
      logLevel: <const>'silent',
      socket: {
        domain: `https://${this.address}:${this.port}`,
      },
      ui: {
        port: this.uiPort,
      },
      snippetOptions: {
        rule: {
          match: /<head[^>]*>/i,
          fn(snippet: string, match: string) {
            return match + snippet;
          },
        },
      },
    };

    return new Promise((resolve) => {
      this.server = this.bs.init(bsConfig, resolve);
    });
  }
}