import * as path from 'path';
import { SchemaPaths, SCHEMA_PATHS, slateConfigCreate, slateSchemaCreate } from '@process-creative/slate-config';

export type SchemaEnv = SchemaPaths & {
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
}

export const SCHEMA_ENV = slateSchemaCreate<SchemaEnv>(config => ({
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
}));

export const config = slateConfigCreate(SCHEMA_ENV);