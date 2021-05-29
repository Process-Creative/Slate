import webpack from 'webpack';
import webpackConfig from './config/prod';

export const webpackBuild = () => {
  return new Promise<boolean>((resolve,reject) => {
    webpack(webpackConfig, (err,stats) => {
      if (err) {
        reject(err);
        throw err;
      };
      console.log(`${stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      })}`);
      console.log('');
      if (stats.compilation.errors.length) process.exit(1);
      
      resolve(true);
    });
  });
}