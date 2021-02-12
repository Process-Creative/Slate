// Set NODE_ENV so slate.config.js can return different values for
// production vs development builds
process.env.NODE_ENV = 'development';

import minimist from 'minimist';
import figures from 'figures';
import chalk from 'chalk';
import ora from 'ora';
import ip from 'ip';
import * as env from '@process-creative/slate-env';
import open from 'open';

import { continueIfPulishedTheme } from './../prompts/continue-if-published-theme';
import {promptSkipSettingsData} from './../prompts/skip-settings-data';
import {promptExternalTesting} from './../prompts/external-testing';

import { AssetServer } from './../../asset-server';
import { DevServer } from './../../dev-server';
import webpackConfig from '../../webpack/config/dev';
import { getAvailablePortSeries } from './../../tools/network';
import { slateToolsConfig } from './../../schema';
import webpack from 'webpack';

const argv = minimist(process.argv.slice(2));
const spinner = ora(chalk.magenta(' Compiling...'));

let firstSync = true;
let skipSettingsData = null;
let continueIfPublishedTheme = null;
let assetServer: AssetServer;
let devServer: DevServer;
let previewUrl: string;

Promise.all([
  getAvailablePortSeries(slateToolsConfig.get('network.startPort'), 3),
  promptExternalTesting(),
])
  .then(([ports, external]) => {
    const address = external
      ? slateToolsConfig.get('network.externalTesting.address') || ip.address()
      : 'localhost';

    assetServer = new AssetServer({
      env: argv.env,
      skipFirstDeploy: argv.skipFirstDeploy,
      webpackConfig,
      port: ports[1],
      address,
    });

    devServer = new DevServer({
      port: ports[0],
      uiPort: ports[2],
      address,
    });

    previewUrl = `https://${env.getStoreValue()}?preview_theme_id=${env.getThemeIdValue()}`;

    assetServer.compiler.hooks.compile.tap('CLI', onCompilerCompile);
    assetServer.compiler.hooks.done.tap('CLI', onCompilerDone);
    assetServer.client.hooks.beforeSync.tapPromise('CLI', onClientBeforeSync);
    assetServer.client.hooks.syncSkipped.tap('CLI', onClientSyncSkipped);
    assetServer.client.hooks.sync.tap('CLI', onClientSync);
    assetServer.client.hooks.syncDone.tap('CLI', onClientSyncDone);
    assetServer.client.hooks.afterSync.tap('CLI', onClientAfterSync);

    return assetServer.start();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function onCompilerCompile() {
  spinner.start();
}

function onCompilerDone(stats: webpack.Stats) {
  const statsJson = stats.toJson({}, true);

  spinner.stop();

  if (statsJson.errors.length) {
    console.log(chalk.red('Failed to compile.\n'));

    statsJson.errors.forEach((message) => {
      console.log(`${message}\n`);
    });
  }

  if (statsJson.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));

    statsJson.warnings.forEach((message: string) => {
      console.log(`${message}\n`);
    });
  }

  if (!statsJson.errors.length && !statsJson.warnings.length) {
    console.log(
      `${chalk.green(figures.tick)}  Compiled successfully in ${statsJson.time /
        1000}s!`,
    );
  }
}

const onClientBeforeSync = async (files: string[]) => {
  if(firstSync && argv.skipFirstDeploy) {
    assetServer.skipDeploy = true;
    return;
  }

  if (continueIfPublishedTheme === null) {
    try {
      continueIfPublishedTheme = await continueIfPulishedTheme();
    } catch (error) {
      console.log(`\n${chalk.red(error)}\n`);
    }
  }


  if(!continueIfPublishedTheme) process.exit(0);

  if(skipSettingsData === null) {
    skipSettingsData = await promptSkipSettingsData(files);
  }

  if (!skipSettingsData) return;
  assetServer.files = files.filter(file => !file.endsWith('settings_data.json'));
}

function onClientSyncSkipped() {
  if (!(firstSync && argv.skipFirstDeploy as boolean)) return;
  
  console.log(
    `\n${chalk.blue(
      figures.info,
    )}  Skipping first deployment because --skipFirstDeploy flag`,
  );
}

function onClientSync() {
}

function onClientSyncDone() {
  // process.stdout.write(consoleControl.previousLine(4));
  // process.stdout.write(consoleControl.eraseData());
  // console.log(`${chalk.green(figures.tick)}  Files uploaded successfully!`);
}

const logPreviewInformation = (devServer: DevServer) => {
  const urls = devServer.server.options.get('urls');

  console.log();
  console.log(
    `${chalk.yellow(
      figures.star,
    )}  You are editing files in theme ${chalk.green(
      env.getThemeIdValue(),
    )} on the following store:\n`,
  );

  console.log(`      ${chalk.cyan(previewUrl)}`);

  console.log();
  console.log(`   Your theme can be previewed at:\n`);
  console.log(
    `      ${chalk.cyan(urls.get('local'))} ${chalk.grey('(Local)')}`,
  );

  if (devServer.address !== 'localhost') {
    console.log(
      `      ${chalk.cyan(urls.get('external'))} ${chalk.grey('(External)')}`,
    );
  }
  console.log();
  console.log(`   Assets are being served from:\n`);

  console.log(
    `      ${chalk.cyan(`https://localhost:${assetServer.port}`)} ${chalk.grey(
      '(Local)',
    )}`,
  );

  if (assetServer.address !== 'localhost') {
    console.log(
      `      ${chalk.cyan(
        `https://${assetServer.address}:${assetServer.port}`,
      )} ${chalk.grey('(External)')}`,
    );
  }

  console.log();
  console.log(`   The Browsersync control panel is available at:\n`);

  if (devServer.address !== 'localhost') {
    console.log(
      `      ${chalk.cyan(urls.get('ui-external'))} ${chalk.grey(
        '(External)',
      )}`,
    );
  }

  console.log(chalk.magenta('\nWatching for changes...'));
}

async function onClientAfterSync() {
  if(!firstSync) return;
  firstSync = false;
  await devServer.start();
  await open(previewUrl);
  logPreviewInformation(devServer);
}
