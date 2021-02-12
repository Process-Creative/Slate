import minimist from 'minimist';
import chalk from 'chalk';
import { replace, upload } from '@process-creative/slate-sync';
import { continueIfPulishedTheme } from '../prompts/continue-if-published-theme';

const argv = minimist(process.argv.slice(2));
const deploy = argv.replace ? replace : upload;

continueIfPulishedTheme().then((answer: boolean) => {
  if (!answer) {
    process.exit(0);
  }

  return deploy();
}).then(() => {
  return console.log(chalk.green('\nFiles overwritten successfully!\n'));
}).catch((error) => {
  console.log(`\n${chalk.red(error)}\n`);
});
