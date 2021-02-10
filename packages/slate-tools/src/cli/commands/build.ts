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
const packageJson = require('./../../../package.json');

webpack(webpackConfig, (err, stats) => {
  if (err) throw err;
  
  process.stdout.write(
    `${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}`,
  );

  console.log('');

  if (stats.compilation.errors.length) process.exit(1);
});