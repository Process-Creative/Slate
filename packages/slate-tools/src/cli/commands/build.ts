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
import * as slateEnv from '@process-creative/slate-env';
import minimist from 'minimist';
import chalk from 'chalk';

const argv = minimist(process.argv.slice(2));

const result = slateEnv.validate();
if(!result.isValid) {
  console.log(chalk.red(
    `Some values in environment '${slateEnv.getEnvNameValue()}' are invalid:`,
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
  if (stats.compilation.errors.length) process.exit(1);
});