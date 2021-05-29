#!/usr/bin/env node
import spawn from 'cross-spawn';
import chalk from 'chalk';
import minimist from 'minimist';
import { assign } from '../env/tasks';

const argv = minimist(process.argv.slice(2));
const script = process.argv[2];
const args = process.argv.slice(3);

try {
  assign(argv.env);
} catch (error) {
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
    case 'compare':
    case 'download':
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
