const fs = require('fs');
const path = require('path');
const SlateConfig = require('@process-creative/slate-config');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const schema = require('./../../../slate-tools.schema.js');
const config = new SlateConfig(schema);

const PATH_UTILITIES = path.resolve(
  __dirname, '..', '..', '..', '..', 'src', 'webpack', 'config', 'utilities'
);

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$|\.ts$/,
        exclude: config.get('webpack.babel.exclude'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [ '@babel/preset-env', {
                "useBuiltIns": "usage",
                "corejs": { version: 3, proposals: true },
                "targets": "> 0.25%, not dead"
              } ], 
              [ '@babel/preset-typescript', {
                onlyRemoveTypeImports: true
              } ]
            ]
          }
        }
      }
    ]
  },
  
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // logger: { infrastructure: 'silent', issues: 'silent', devServer: true },
      typescript: {
        configFile: path.resolve(PATH_UTILITIES, 'tsconfig.json'),
        mode: 'write-references',
        logger: { infrastructure: 'silent', issues: 'console', devServer: true },
        configOverwrite: {
          include: [
            `${config.get('paths.theme.src')}/**/*`,
            path.resolve(PATH_UTILITIES, 'empty.d.ts') //Add an empty definition file to satisfy Typescript for projects without TS
          ]
        },
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      }
    })
  ],
};