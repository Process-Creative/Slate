const fs = require('fs');
const SlateConfig = require('@process-creative/slate-config');

const config = new SlateConfig(require('../../../../slate-tools.schema'));

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: config.get('webpack.babel.exclude'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  "useBuiltIns": "usage",
                  "corejs": { version: 3, proposals: true },
                  "targets": "> 0.25%, not dead"
                }
              ]
            ]
          }
        }
      }
    ]
  }
};