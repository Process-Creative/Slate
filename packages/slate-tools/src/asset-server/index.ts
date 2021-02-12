import webpack, { Compiler } from 'webpack';
import { createServer } from 'https';
import { createHash } from 'crypto';
import { Client } from './client';
import { isHotUpdateFile } from '../tools/hot';
import { sslKeyCert } from '../tools/ssl';
import { Server } from 'http';
import { App } from './app';
import { slateToolsConfig } from '../schema';

type AssetServerOptions = {
  env: string;
  skipFirstDeploy: boolean;
  address:string;
  port:number;
  webpackConfig: any;
};

/**
 * https://webpack.js.org/glossary/#a
 * 
 * This webpack-specific term is used internally to manage the bundling 
 * process. Bundles are composed out of chunks, of which there are several 
 * types (e.g. entry and child). Typically, chunks directly correspond with 
 * the output bundles however, there are some configurations that don't yield 
 * a one-to-one relationship.
 */
export interface Asset {
  source: () => string,
  size: () => number
  emitted: () => boolean;
  existsAt: string;
}

export interface Assets {
  [key: string]: Asset;
}

/**
 * https://webpack.js.org/glossary/#c
 * 
 * This webpack-specific term is used internally to manage the 
 * bundling process. Bundles are composed out of chunks, of which 
 * there are several types (e.g. entry and child). Typically, chunks 
 * directly correspond with the output bundles however, there are some 
 * configurations that don't yield a one-to-one relationship.
 */
export interface Chunk {
  id: string;
}

export class AssetServer {
  public assetHashes:{
    [key:string]:string
  };
  public address:string;
  public port:number;
  public options:AssetServerOptions;
  public compiler:Compiler;
  public app:App;
  public client:Client;

  public ssl?:ReturnType<typeof sslKeyCert>;
  public server:Server;

  constructor(options:AssetServerOptions) {
    options.webpackConfig.output.publicPath = `https://${options.address}:${options.port}/`;

    this.assetHashes = {};
    this.address = options.address;
    this.options = options;
    this.port = options.port;
    this.compiler = webpack(options.webpackConfig);
    this.app = new App(this.compiler);
    this.client = new Client();
    this.client.hooks.afterSync.tap(
      'HotMiddleWare',
      this.onAfterSync.bind(this),
    );
  }

  start() {
    this.compiler.hooks.done.tapPromise(
      'DevServer',
      this.onCompileDone.bind(this),
    );
    this.ssl = sslKeyCert();
    this.server = createServer(this.ssl, this.app.app);
    this.server.listen(this.port);
  }

  set files(files:string[]) {
    this.client.files = files;
  }

  set skipDeploy(value:boolean) {
    this.client.skipNextSync = value;
  }

  private onCompileDone(stats: webpack.Stats) {
    const files = this.getAssetsToUpload(stats);

    return this.client.sync(files, stats);
  }

  private onAfterSync(files: string[]) {
    this.app.webpackHotMiddleware.publish({
      action: 'shopify_upload_finished',
      force: files.length > 0,
    });
  }

  private isChunk(key: string, chunks: Chunk[]) {
    return (
      chunks.filter((chunk) => {
        return key.indexOf(chunk.id) > -1 && !this.isLiquidStyle(key);
      }).length > 0
    );
  }

  private isLiquidStyle(key: string) {
    return key.indexOf('styleLiquid.scss.liquid') > -1;
  }

  private hasAssetChanged(key: string, asset: Asset) {
    const oldHash = this.assetHashes[key];
    const newHash = this.updateAssetHash(key, asset);

    return oldHash !== newHash;
  }

  private getAssetsToUpload(stats:webpack.Stats) {
    const assets = Object.entries(stats.compilation.assets as Assets);
    const chunks = stats.compilation.chunks as Chunk[];

    return (
      assets.filter(([key, asset]) => (
        asset.emitted &&
        !this.isChunk(key, chunks) &&
        !isHotUpdateFile(key) &&
        this.hasAssetChanged(key, asset)
      )).map(([key, asset]) => {
        return asset.existsAt.replace(slateToolsConfig.get('paths.theme.dist'), '');
      })
    );
  }

  private updateAssetHash(key:string, asset: Asset) {
    const rawSource = asset.source();
    const source = Array.isArray(rawSource) ? rawSource.join('\n') : rawSource;
    const hash = createHash('sha256')
      .update(source)
      .digest('hex');

    return (this.assetHashes[key] = hash);
  }
};