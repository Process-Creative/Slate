const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin  = require('terser-webpack-plugin');
const SlateConfig = require('@process-creative/slate-config');
const SlateTagPlugin = require('@process-creative/slate-tag-webpack-plugin');

const { partsBabel } = require('./parts/babel');
const { partSass } = require('./parts/sass');
const { partsEntry } = require('./parts/entry');
const core = require('./parts/core');
const { partCss } = require('./parts/css');

const packageJson = require('../../../package.json');
const { getChunkName } = require('../get-chunk-name');
const { getLayoutEntryPoints } = require('./utilities/get-layout-entrypoints');
const { getTemplateEntryPoints } = require('./utilities/get-template-entrypoints');
const { HtmlWebpackIncludeLiquidStylesPlugin } = require('../html-webpack-include-chunks');

const schema = require('./../../slate-tools.schema.js');
const config = new SlateConfig(schema);

const { getScriptTemplate } = require('./../templates/script-tags-template');
const { getStyleTemplate } = require('./../templates/style-tags-template');

module.exports = merge([
  core,
  partsEntry,
  partsBabel,
  partSass,
  partCss,
  {
    mode: 'production',
    devtool: 'hidden-source-map',

    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),

      new webpack.DefinePlugin({
        'process.env': {NODE_ENV: '"production"'},
      }),
      
      new HtmlWebpackPlugin({
        excludeChunks: ['static'],
        filename: `../snippets/tool.script-tags.liquid`,
        templateContent: (...params) => getScriptTemplate(...params),
        inject: false,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: true,
        },
        liquidTemplates: getTemplateEntryPoints(),
        liquidLayouts: getLayoutEntryPoints(),
      }),

      new HtmlWebpackPlugin({
        filename: `../snippets/tool.style-tags.liquid`,
        templateContent: (...params) => getStyleTemplate(...params),
        inject: false,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          preserveLineBreaks: true,
        },
        liquidTemplates: getTemplateEntryPoints(),
        liquidLayouts: getLayoutEntryPoints(),
      }),

      new HtmlWebpackIncludeLiquidStylesPlugin(),

      new SlateTagPlugin(packageJson.version),
    ],

    optimization: {
      splitChunks: {
        name: getChunkName
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          sourceMap: true
        })
      ],
    },
  },
  config.get('webpack.extend'),
]);
