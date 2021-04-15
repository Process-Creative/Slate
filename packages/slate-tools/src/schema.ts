import * as path from 'path';
import * as os from 'os';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano'
import { SchemaPaths, SCHEMA_PATHS, slateConfigCreate, slateSchemaCreate } from '@process-creative/slate-config';

export type SchemaTools = SchemaPaths & {
  /** The filename of the default env file */
  'env.basename':string,

  /** Root directory to look for .env file */
  'env.rootDirectory':string;

  /** Path to default .env file */
  'env.path':string;

  /** The name of the environment when using the default env file */
  'env.defaultEnvName':string;

  /** The name of the environment when no env file is present */
  'env.externalEnvName':string;

  /**
   * The environment variable key which contains the name of the environment
   * Slate is running in
   */
  'env.keys.name':string;

  /**
   * The environment variable key which contains the myshopify.com URL to your
   * Shopify store
   */
  'env.keys.store':string;

  /**
   * The environment variable key which contains the API password generated from
   * a Private App
   */
  'env.keys.password':string;

  /**
   * The environment variable key which contains the ID of the theme you wish to
   * upload files to
   */
  'env.keys.themeId':string;

  /**
   * The environment variable key which contains a list of file patterns to
   * ignore, with each list item separated by ':'
   */
  'env.keys.ignoreFiles':string;

  /**
   * The environment variable key which contains the timeout of themekit upload
   * Timeout upload is
   */
  'env.keys.timeout':string;

  /** Distribution directory of theme */
  'paths.theme.dist':string;

  /** Distribution assets directory */
  'paths.theme.dist.assets':string;

  /** Distribution assets directory */
  'paths.theme.dist.config':string;

  /** Distribution of theme liquid layout files */
  'paths.theme.dist.layout':string;

  /** Distribution snippets directory */
  'paths.theme.dist.snippets':string;

  /** Distribution snippets directory */
  'paths.theme.dist.locales':string;

  /** Distribution sections directory */
  'paths.theme.dist.sections':string;

  /** Distribution templates directory */
  'paths.theme.dist.templates':string;

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
  ...SCHEMA_PATHS(config),
  
  'env.basename': '.env',
  'env.rootDirectory': () => config.get('paths.theme'),
  'env.path': () => (
    path.resolve(config.get('env.rootDirectory'), config.get('env.basename'))
  ),
  'env.defaultEnvName': 'default',
  'env.externalEnvName': 'external',
  'env.keys.name': 'SLATE_ENV_NAME',
  'env.keys.store': 'SLATE_STORE',
  'env.keys.password': 'SLATE_PASSWORD',
  'env.keys.themeId': 'SLATE_THEME_ID',
  'env.keys.ignoreFiles': 'SLATE_IGNORE_FILES',
  'env.keys.timeout': 'SLATE_TIMEOUT',

  'paths.theme.dist': () => {
    const dir = path.join(config.get('paths.theme'), 'dist');
    const name = process.env[config.get('env.keys.name')] || 'default';
    return path.join(dir, name);
  },

  'paths.theme.dist.assets': () =>
    path.join(config.get('paths.theme.dist'), 'assets'),

  'paths.theme.dist.config': () =>
    path.join(config.get('paths.theme.dist'), 'config'),

  'paths.theme.dist.layout': () =>
    path.join(config.get('paths.theme.dist'), 'layout'),

  'paths.theme.dist.snippets': () =>
    path.join(config.get('paths.theme.dist'), 'snippets'),

  'paths.theme.dist.locales': () =>
    path.join(config.get('paths.theme.dist'), 'locales'),

  'paths.theme.dist.sections': () =>
    path.join(config.get('paths.theme.dist'), 'sections'),

  'paths.theme.dist.templates': () =>
    path.join(config.get('paths.theme.dist'), 'templates'),
  
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