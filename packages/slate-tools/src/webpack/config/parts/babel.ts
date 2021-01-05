import * as path from 'path'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import schema from './../../../slate-tools.schema';
import SlateConfig from '@process-creative/slate-config';
const config = new SlateConfig(schema);

const PATH_UTILITIES = path.resolve(
  __dirname, '..', '..', '..', '..', 'src', 'webpack', 'config', 'utilities'
);

export const partsBabel = {
  module: {
    rules: [
      {
        test: /\.js$|\.ts$/,
        exclude: config.get('webpack.babel.exclude'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [ '@babel/preset-env', {
                "useBuiltIns": "usage",
                "corejs": { version: 3, proposals: true },
                "targets": "> 0.25%, not dead"
              } ], 
              [ '@babel/preset-typescript', {
                onlyRemoveTypeImports: true
              } ]
            ]
          }
        }
      }
    ]
  },
  
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: false,
      logger: { infrastructure: 'silent', issues: 'silent', devServer: true },
      typescript: {
        configFile: path.resolve(PATH_UTILITIES, 'tsconfig.json'),
        mode: 'write-references',

        //@ts-ignore
        logger: { infrastructure: 'silent', issues: 'console', devServer: true }, // This is spec, don't know why it's complaining

        configOverwrite: {
          include: [
            `${config.get('paths.theme.src')}/**/*`,
            path.resolve(PATH_UTILITIES, 'empty.d.ts') //Add an empty definition file to satisfy Typescript for projects without TS
          ]
        },
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      }
    })
  ],
};