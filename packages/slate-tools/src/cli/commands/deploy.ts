// Set NODE_ENV so slate.config.js can return different values for
// production vs development builds
process.env.NODE_ENV = 'production';


/*
* Run Webpack with the webpack.prod.conf.js configuration file. Write files to disk.
*
* If the `deploy` argument has been passed, deploy to Shopify when the compilation is done.
*/
import webpack from 'webpack';
import webpackConfig from './../../webpack/config/prod';
import minimist from 'minimist';
import chalk from 'chalk';
import { continueIfPulishedTheme } from '../prompts/continue-if-published-theme';
import { replace, upload } from '../../shopify/sync';
import { validate } from '../../env/tasks';
import { getEnvNameValue } from '../../env/value';

const argv = minimist(process.argv.slice(2));

const result = validate();
if(!result.isValid) {
  console.log(chalk.red(
    `Some values in environment '${getEnvNameValue()}' are invalid:`,
  ));
  result.errors.forEach((error) => {
    console.log(chalk.red(`- ${error}`));
  });
}

webpack(webpackConfig, (err,stats) => {
  if (err) throw err;
  console.log(`${stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  })}`);
  console.log('');
  
  
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
});