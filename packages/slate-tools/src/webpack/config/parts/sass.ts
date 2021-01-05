import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import SlateConfig from '@process-creative/slate-config';
import schema from './../../../slate-tools.schema';

const config = new SlateConfig(schema);
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
              sourceMap: config.get('webpack.sourceMap.styles'),
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
              sourceMap: config.get('webpack.sourceMap.styles'),
              plugins: config.get('webpack.postcss.plugins'),
            },
          },

          // SCSS / SASS Loader
          {
            loader: 'sass-loader',
            options: {sourceMap: config.get('webpack.sourceMap.styles')},
          },
        ]
      }
    ]
  },

  plugins: [

  ],
};