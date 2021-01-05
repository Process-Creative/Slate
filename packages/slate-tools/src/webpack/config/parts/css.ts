import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import SlateConfig from '@process-creative/slate-config';
import schema from './../../../slate-tools.schema';

const config = new SlateConfig(schema);
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
              plugins: config.get('webpack.postcss.plugins'),
            },
          }
        ]
      }
    ]
  },

  plugins: [

  ],
};