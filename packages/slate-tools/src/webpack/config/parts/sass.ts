import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { slateToolsConfig } from '../../../schema';
const isDev = process.env.NODE_ENV === 'development';

export const partSass = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // Default Style Loader
          ...[
            isDev ? { loader: 'style-loader' } : MiniCssExtractPlugin.loader 
          ],

          // CSS Loader
          {
            loader: 'css-loader',
            options: {
              sourceMap: slateToolsConfig.get('webpack.sourceMap.styles'),
              modules: {
                compileType: 'icss',
              }
            },
          },

          // PostCSS Loader
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: slateToolsConfig.get('webpack.sourceMap.styles'),
              plugins: slateToolsConfig.get('webpack.postcss.plugins'),
            },
          },

          // SCSS / SASS Loader
          {
            loader: 'sass-loader',
            options: {sourceMap: slateToolsConfig.get('webpack.sourceMap.styles')},
          },
        ]
      }
    ]
  },

  plugins: [

  ],
};