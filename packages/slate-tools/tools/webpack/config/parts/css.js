const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SlateConfig = require('@process-creative/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

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
  // Enabling sourcemaps in styles when using HMR causes style-loader to inject
  // styles using a <link> tag instead of <style> tag. This causes
  // a FOUC content, which can cause issues with JS that is reading
  // the DOM for styles (width, height, visibility) on page load.
  options: {sourceMap: !isDev},
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
