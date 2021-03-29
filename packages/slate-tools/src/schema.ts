import * as path from 'path';
import * as os from 'os';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano'
import { SchemaPaths, SCHEMA_PATHS, slateConfigCreate, slateSchemaCreate } from '@process-creative/slate-config';
import { SchemaEnv, SCHEMA_ENV } from '@process-creative/slate-env';

export type SchemaTools = SchemaPaths & SchemaEnv & {
  /** Enable/disable the prompt to skip uploading settings_data.json */
  'cli.promptSettings':boolean;

  /**
   * Slate will reference files using your local IP address instead of localhost
   * This is mostly to get around SSL complications when trying to preview
   * your development store from an external device like your phone. Use this
   * config if you want to disable using your local IP and external testing.
   */
  'network.externalTesting':boolean;

  /**
   * If 'network.externalTesting' is true, the defaultaddress used to to
   * reference local files will be your local IP address. Set this value
   * if you wish to specify another network address.
   */
  'network.externalTesting.address':string | null;

  /**
   * Default port used for asset server. If it is not available, the next port
   * that is available is used.
   */
  'network.startPort':number;

  /**
   * Path to self-signed SSL certificate which is used when developing
   * (browsersync, asset server) to avoid browsers rejecting requests based
   * on SSL
   */
  'ssl.cert':string;

  /**
   * Path to self-signed SSL key which is used when developing
   * (browsersync, asset server) to avoid browsers rejecting requests based
   * on SSL
   */
  'ssl.key':string;

  /** Include babel-loader in the webpack core config */
  'webpack.babel.enable':boolean;

  /**
   * Sometimes packages in node_modules need to be transpiled by Babel. To
   * allow this, change this config option so that it includes the following
   * pattern:
   *
   * node_modules\/(?!(MY-MODULE|ANOTHER-ONE)\/).*
   * 
   * See https://github.com/webpack/webpack/issues/2031 for more details
   */
  'webpack.babel.exclude':(RegExp|string)[];

  /** Paths to exclude for all webpack loaders */
  'webpack.commonExcludes':(RegExp|string)[];

  /** 
   * Extends webpack development config using 'webpack-merge'
   * https://www.npmjs.com/package/webpack-merge
   */
  'webpack.extend':object;

  /**
   * Enabling sourcemaps in styles when using Hot Module Reloading causes
   * style-loader to inject styles using a <link> tag instead of <style> tag.
   * This causes a FOUC content, which can cause issues with JS that is reading
   * the DOM for styles (width, height, visibility) on page load.
   */
  'webpack.sourceMap.styles':boolean;
  
  /** Array of PostCSS plugins which is passed to the Webpack PostCSS Loader */
  'webpack.postcss.plugins':object[];

  /** Optimization settings for the cssnano plugin */
  'webpack.cssnano.settings':object;

  /** Object which contains entrypoints used in webpack's config.entry key */
  'webpack.entrypoints':object;
}

//Encapsulating to preserve type definitioxns
export const SCHEMA_TOOLS = slateSchemaCreate<SchemaTools>(config => ({
  ...SCHEMA_ENV(config),
  
  'cli.promptSettings': true,

  'network.externalTesting': true,
  'network.externalTesting.address': null,
  'network.startPort': 3000,
  'ssl.cert': path.resolve(os.homedir(), '.localhost_ssl/server.crt'),
  'ssl.key': path.resolve(os.homedir(), '.localhost_ssl/server.key'),
  'webpack.babel.enable': true,
  'webpack.babel.exclude': () => config.get('webpack.commonExcludes'),
  'webpack.commonExcludes': [ /node_modules/, /assets\/static/ ],
  'webpack.extend': {},
  'webpack.sourceMap.styles': () => process.env.NODE_ENV === 'production',
  'webpack.postcss.plugins': () => [ autoprefixer,
    ...(process.env.NODE_ENV === 'production' ? [
      cssnano(config.get('webpack.cssnano.settings'))
    ] : [])
  ],
  'webpack.cssnano.settings': { zindex: false, reduceIdents: false },
  'webpack.entrypoints': {},
}));

export const slateToolsConfig = slateConfigCreate(SCHEMA_TOOLS);