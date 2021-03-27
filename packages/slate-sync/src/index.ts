import chalk from 'chalk';
import figures from 'figures';
import * as https from 'https';
import themekit from '@shopify/themekit';
import slateEnv from '@process-creative/slate-env';
import { config } from './config';

let deploying = false;
let filesToDeploy = [];

/**
 * Deploys only if deployment is necessary. Throws an error if already mid
 * deployment.
 * 
 * @returns A promise that resolves when deployment is complete. 
 */
const maybeDeploy = async () => {
  if (deploying) new Error('Deploy already in progress.');

  if (filesToDeploy.length) {
    const files = [...filesToDeploy];
    filesToDeploy = [];
    return await deploy(false, files);
  }
}

/**
 * Validates slate environment variables, if failed the program will terminate.
 */
const validateEnvValues = () => {
  const result = slateEnv.validate();
  if(result.isValid) return;

  console.log(chalk.red(
    `Some values in environment '${slateEnv.getEnvNameValue()}' are invalid:`,
  ));
  result.errors.forEach((error) => {
    console.log(chalk.red(`- ${error}`));
  });

  process.exit(1);
}

/**
 * Generates Configuration flags to send to themekit.
 * 
 * @returns Theme Kit ready command line flags.
 */
const generateConfigFlags = () => {
  validateEnvValues();

  const flags = {
    password: slateEnv.getPasswordValue(),
    themeId: slateEnv.getThemeIdValue(),
    store: slateEnv.getStoreValue(),
    env: slateEnv.getEnvNameValue(),
    timeout: undefined as undefined|string
  };

  if (slateEnv.getTimeoutValue()) {
    flags.timeout = slateEnv.getTimeoutValue();
  }

  // Convert object to key value pairs and flatten the array
  return flags;
}

/**
 * Generates the array of ignore flags to supply to themekit.
 * 
 * @returns Array of ignored file patterns.
 */
const generateIgnoreFlags = () => {
  const ignoreFiles = slateEnv.getIgnoreFilesValue().split(':');
  return ignoreFiles.filter(pattern => pattern.length);
}

/**
 * Deploy to Shopify using themekit.
 */
const deploy = async (replace:boolean=false, files:string[]=[]) => {
  deploying = true;
  await promiseThemekitConfig();
  await promiseThemekitDeploy('deploy', replace, files);
  deploying = false;

  return maybeDeploy;
}

/** Executes the configuration command. */
const promiseThemekitConfig = async () => {
  return await themekit(
    'configure',
    { ...generateConfigFlags(), ignoredFiles: generateIgnoreFlags() },
    { cwd: config.get('paths.theme.dist') }
  );
};

const promiseThemekitDeploy = async (cmd:string, replace:boolean, files:string[]) => {
  const deployment = await themekit(
    cmd,
    {
      noUpdateNotifier: true,
      ...generateConfigFlags(),
      files: [ ...files ],
      noDelete: !replace,
      'allow-live': true
    },
    { cwd: config.get('paths.theme.dist') }
  );
  return deployment;
}

/**
 * Fetch the main theme ID from Shopify
 *
 * @param   env   String  The environment to check against
 * @return        Promise Reason for abort or the main theme ID
 */
export const fetchMainThemeId = () => {
  validateEnvValues();

  return new Promise((resolve, reject) => {
    https.get(
      {
        hostname: slateEnv.getStoreValue(),
        path: '/admin/themes.json',
        auth: `:${slateEnv.getPasswordValue}`,
        agent: false,
        headers: { 'X-Shopify-Access-Token': slateEnv.getPasswordValue() },
      },
      res => {
        let body = '';
        res.on('data', (datum) => (body += datum));
        res.on('end', () => {
          const parsed = JSON.parse(body);

          if (parsed.errors) {
            reject(
              new Error(
                `API request to fetch main theme ID failed: \n${JSON.stringify(
                  parsed.errors,
                  null,
                  '\t',
                )}`,
              ),
            );
            return;
          }

          if (!Array.isArray(parsed.themes)) {
            reject(
              new Error(
                `Shopify response for /admin/themes.json is not an array. ${JSON.stringify(
                  parsed,
                  null,
                  '\t',
                )}`,
              ),
            );
            return;
          }

          const mainTheme = parsed.themes.find((t) => t.role === 'main');

          if (!mainTheme) {
            reject(
              new Error(
                `No main theme in response. ${JSON.stringify(
                  parsed.themes,
                  null,
                  '\t',
                )}`,
              ),
            );
            return;
          }

          resolve(mainTheme.id);
        });
      },
    );
  });
}

export const sync = async (files:string[] = []) => {
  if (!files.length) new Error('No files to deploy.');
  filesToDeploy = [ ...new Set([ ...filesToDeploy, ...files ]) ];
  return await maybeDeploy();
};

export const replace = () => deploy(true);
export const upload = () => deploy(false);