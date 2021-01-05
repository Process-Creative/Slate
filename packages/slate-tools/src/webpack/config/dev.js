const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SlateConfig = require('@process-creative/slate-config');

const core = require('./parts/core');
const babel = require('./parts/babel');
const { partsEntry } = require('./parts/entry');
const { partSass } = require('./parts/sass');
const { partCss } = require('./parts/css');

const { getLayoutEntryPoints } = require('./utilities/get-layout-entrypoints');
const { getTemplateEntryPoints } = require('./utilities/get-template-entrypoints');
const { HtmlWebpackIncludeLiquidStylesPlugin } = require('../html-webpack-include-chunks');
const config = new SlateConfig(require('../../slate-tools.schema'));

const { getScriptTemplate } = require('./../templates/script-tags-template');
const { getStyleTemplate } = require('./../templates/style-tags-template');

// add hot-reload related code to entry chunks
Object.keys(partsEntry.entry).forEach((name) => {
  partsEntry.entry[name] = [path.join(__dirname, '../hot-client.js')].concat(
    partsEntry.entry[name],
  );
});

module.exports = merge([
  core,
  partsEntry,
  babel,
  partSass,
  partCss,
  {
    mode: 'development',

    devtool: '#eval-source-map',

    plugins: [
      new webpack.HotModuleReplacementPlugin(),

      //Static scripts
      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `../snippets/tool.script-tags.liquid`,
        templateContent: (...params) => getScriptTemplate(...params),
        inject: false,
        minify: {
          removeComments: true,
          removeAttributeQuotes: false,
        },
        isDevServer: true,
        liquidTemplates: getTemplateEntryPoints(),
        liquidLayouts: getLayoutEntryPoints(),
      }),

      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `../snippets/tool.style-tags.liquid`,
        templateContent: (...params) => getStyleTemplate(...params),
        inject: false,
        minify: {
          removeComments: true,
          removeAttributeQuotes: false,
        },
        isDevServer: true,
        liquidTemplates: getTemplateEntryPoints(),
        liquidLayouts: getLayoutEntryPoints(),
      }),

      new HtmlWebpackIncludeLiquidStylesPlugin(),
    ],
  },
  config.get('webpack.extend'),
]);
