import * as path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import slateSchema from './../../slate-tools.schema';
import SlateConfig from '@process-creative/slate-config';

import { partCore } from './parts/core';
import { partBabel } from './parts/babel';
import { partEntry } from './parts/entry';
import { partSass } from './parts/sass';
import { partCss } from './parts/css';

import { getScriptTemplate } from './../templates/script-tags-template';
import { getStyleTemplate } from './../templates/style-tags-template';
import { getLayoutEntryPoints } from './utilities/get-layout-entrypoints';
import { getTemplateEntryPoints } from './utilities/get-template-entrypoints';
import { HtmlWebpackIncludeLiquidStylesPlugin } from '../html-webpack-include-chunks';

const config = new SlateConfig(slateSchema);

// add hot-reload related code to entry chunks
Object.keys(partEntry.entry).forEach((name) => {
  partEntry.entry[name] = [path.join(__dirname, '../hot-client.js')].concat(
    partEntry.entry[name],
  );
});

export = merge([
  partCore,
  partEntry,
  partBabel,
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
        //@ts-ignore
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
        //@ts-ignore
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
