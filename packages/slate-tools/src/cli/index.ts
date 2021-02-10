#!/usr/bin/env ts-node-script
import spawn from 'cross-spawn';
import chalk from 'chalk';
import minimist from 'minimist';
import * as slateEnv from '@process-creative/slate-env';
import * as fs from 'fs';
import * as path from 'path';

const PATH_TSCONFIG = path.join(__dirname, '..', '..', 'tsconfig.json');

const argv = minimist(process.argv.slice(2));
const script = process.argv[2];
const args = process.argv.slice(3);
const tsconfig = JSON.parse(fs.readFileSync(PATH_TSCONFIG, 'utf-8'));

try {
  slateEnv.assign(argv.env);
} catch (error) {
  console.error(slateEnv);
  console.log(chalk.red(error));
  process.exit(1);
}

let result:ReturnType<typeof spawn.sync>;

async function init() {
  switch (script) {
    case 'build':
    case 'deploy':
    case 'start':
    case 'zip':
    case 'env':
    case 'test':
    case 'open':
      require(`./commands/${script}`);
      break;
      
    case 'test':
      result = spawn.sync('../node_modules/jest/bin/jest.js', [].concat(args), {
        stdio: 'inherit',
      });
      process.exit(result.status);
      break;
    default:
      console.log(`Unknown script "${script}".`);
      console.log('Perhaps you need to update slate-tools?');
      break;
  }
}

init();
