const fs = require('fs');
const path = require('path');
const SlateConfig = require('@process-creative/slate-config');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const config = new SlateConfig(require('../../../../slate-tools.schema'));

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
        configFile: path.resolve(__dirname, '..', 'utilities', 'tsconfig.json'),
        mode: 'write-references',
        logger: { infrastructure: 'silent', issues: 'console', devServer: true },
        configOverwrite: {
          include: [
            `${config.get('paths.theme.src')}/**/*`
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