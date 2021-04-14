import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { slateToolsConfig } from '../../../schema';
import { SlateSectionsPlugin } from '../../plugin/slate-sections-plugin';

const PATH_THEME_NODE_MODULES = path.join(slateToolsConfig.get('paths.theme'), 'node_modules');
const PATH_MONOREPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const PATH_MONOREPO_NODEMODULES = path.resolve(PATH_MONOREPO_ROOT, 'node_modules');
const PATH_MONOREPO_SLATETOOLS_ROOT = path.resolve(PATH_MONOREPO_ROOT, 'packages', 'slate-tools');
const PATH_MONOREPO_SLATETOOLS_NODEMOUDLES = path.resolve(PATH_MONOREPO_SLATETOOLS_ROOT, 'node_modules');
const PATH_MONOREPO_SLATETOOLS_WEBPACK_ROOT = path.resolve(PATH_MONOREPO_SLATETOOLS_ROOT, 'dist', 'webpack');
const PATH_NODEMODULE_SLATETOOLS_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const PATH_NODEMODULE_SLATETOOLS_NODEMODULES = path.resolve(PATH_NODEMODULE_SLATETOOLS_ROOT, 'node_modules');

//Directories
const modules = [
  PATH_THEME_NODE_MODULES,
  PATH_MONOREPO_ROOT,
  PATH_MONOREPO_NODEMODULES,
  PATH_MONOREPO_SLATETOOLS_ROOT,
  PATH_MONOREPO_SLATETOOLS_NODEMOUDLES,
  PATH_MONOREPO_SLATETOOLS_WEBPACK_ROOT,
  PATH_NODEMODULE_SLATETOOLS_ROOT,
  PATH_NODEMODULE_SLATETOOLS_NODEMODULES
];

export const partCore = {
  context: slateToolsConfig.get('paths.theme.src'),

  output: {
    filename: '[name].js',
    path: slateToolsConfig.get('paths.theme.dist.assets'),
    jsonpFunction: 'shopifySlateJsonp',
  },

  resolveLoader: {
    modules
  },

  resolve: {
    modules,
    extensions: [ '.wasm', '.mjs', '.js', '.json', '.jsx', '.ts', '.tsx' ]
  },

  externals: {
    jquery: 'jQuery',
    jQuery: 'jQuery',
    $: 'jQuery'
  },

  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2|otf)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'file-loader', options: { name: '[name].[ext]' } }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: slateToolsConfig.get('webpack.commonExcludes'),
        use: [
          { loader: 'file-loader', options: {name: '[name].[ext]'}},
          { loader: 'img-loader' },
        ],
      },
      {
        test: /\.(liquid|json)$/,
        exclude: [
          /(css|scss|sass)\.liquid$/,
          ...slateToolsConfig.get('webpack.commonExcludes'),
        ],
        loader: 'file-loader',
        options: {
          name: '../[path][name].[ext]',
        },
      }
    ],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: slateToolsConfig.get('paths.theme.src.assets'),
          to: slateToolsConfig.get('paths.theme.dist.assets'),
          flatten: true,
        },
        {
          from: slateToolsConfig.get('paths.theme.src.config'),
          to: slateToolsConfig.get('paths.theme.dist.config'),
        },
        {
          from: slateToolsConfig.get('paths.theme.src.layout'),
          to: slateToolsConfig.get('paths.theme.dist.layout'),
        },
        {
          from: slateToolsConfig.get('paths.theme.src.locales'),
          to: slateToolsConfig.get('paths.theme.dist.locales'),
        },
        {
          from: slateToolsConfig.get('paths.theme.src.templates'),
          to: slateToolsConfig.get('paths.theme.dist.templates'),
        }
      ]
    }),

    //Sections
    new SlateSectionsPlugin({
      from: slateToolsConfig.get('paths.theme.src.sections'),
      to: slateToolsConfig.get('paths.theme.dist.sections'),
    }),

    //Snippets
    new SlateSectionsPlugin({
      from: slateToolsConfig.get('paths.theme.src.snippets'),
      to: slateToolsConfig.get('paths.theme.dist.snippets'),
    }),
  ]
};
