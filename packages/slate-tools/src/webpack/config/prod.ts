import webpack from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { SlateTagWebpackPlugin } from '@process-creative/slate-tag-webpack-plugin';

import { partCore } from './parts/core';
import { partBabel } from './parts/babel';
import { partEntry } from './parts/entry';
import { partSass } from './parts/sass';
import { partCss } from './parts/css';
import { chunkGetName } from '../../utils/get-chunk-name';

import { getScriptTemplate } from './../templates/script-tags-template';
import { getStyleTemplate } from './../templates/style-tags-template';
import { getLayoutEntryPoints } from './utilities/get-layout-entrypoints';
import { getTemplateEntryPoints } from './utilities/get-template-entrypoints';
import { HtmlWebpackIncludeLiquidStylesPlugin } from '../plugin/html-webpack-include-chunks';
import { slateToolsConfig } from '../../schema';

const packageJson = require('../../../package.json');

export = merge([
  partCore,
  partEntry,
  partBabel,
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
        //@ts-ignore
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
        //@ts-ignore
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

      new SlateTagWebpackPlugin(packageJson.version),
    ],

    optimization: {
      splitChunks: {
        name: chunkGetName
      },
      minimize: true,
      minimizer: [
        new TerserPlugin({
          sourceMap: true
        })
      ],
    },
  },
  slateToolsConfig.get('webpack.extend'),
]);
