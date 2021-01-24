import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { slateToolsConfig } from '../../../schema';
const isDev = process.env.NODE_ENV === 'development';

export const partCss = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // Default Style Loader
          ...[
            isDev ? { loader: 'style-loader' } : MiniCssExtractPlugin.loader 
          ],

          // CSS Loader
          {
            loader: 'css-loader',
            options: {
              sourceMap: !isDev,
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
              sourceMap: !isDev,
              plugins: slateToolsConfig.get('webpack.postcss.plugins'),
            },
          }
        ]
      }
    ]
  },

  plugins: [

  ],
};