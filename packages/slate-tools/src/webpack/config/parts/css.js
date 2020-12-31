const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SlateConfig = require('@process-creative/slate-config');
const schema = require('./../../../slate-tools.schema.js');
const config = new SlateConfig(schema);


const isDev = process.env.NODE_ENV === 'development';

const part = {
  module: {
    rules: [],
  },
  plugins: [],
};

const cssRule = {
  test: /\.css$/,
};

const styleLoader = {
  loader: 'style-loader'
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: !isDev,
    modules: {
      compileType: 'icss',
    }
  }
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: !isDev,
    plugins: config.get('webpack.postcss.plugins'),
  },
};

cssRule.use = [
  ...(isDev ? [styleLoader] : [ MiniCssExtractPlugin.loader ]),
  cssLoader,
  postcssLoader,
];
part.module.rules.push(cssRule);

module.exports = part;