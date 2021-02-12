import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { Assets, Chunk } from '../asset-server';

type HtmlWebpackIncludeLiquidStylesPluginOptions = any;

export interface HtmlPluginData {
  assets: Assets;
}
export class HtmlWebpackIncludeLiquidStylesPlugin {
  public options?:HtmlWebpackIncludeLiquidStylesPluginOptions;
  public files:string[];
  public compilation:webpack.compilation.Compilation;
  public chunks:Chunk[];

  constructor(options?:HtmlWebpackIncludeLiquidStylesPluginOptions) {
    this.options = options;
    this.files = [];
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(
      'htmlWebpackIncludeChunksPlugin',
      this.onCompilation.bind(this),
    );
  }

  onCompilation(compilation:webpack.compilation.Compilation) {
    this.compilation = compilation;

    // HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tap(
    //   'htmlWebpackIncludeChunksPlugin',
    //   this.onAlterChunks.bind(this),
    // );

    // HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tap(
    //   'htmlWebpackIncludeChunksPlugin',
    //   this.onBeforeHtmlGeneration.bind(this),
    // );
  }

  onAlterChunks(...chunks: Chunk[]) {
    this.chunks = chunks;
  }

  onBeforeHtmlGeneration(htmlPluginData: HtmlPluginData) {
    // console.log(htmlPluginData);
    // const assets = htmlPluginData.assets;
    // const publicPath = assets.publicPath;

    // this.chunks.forEach((chunk) => {
    //   const name = chunk.names[0];
    //   const chunkFiles = []
    //     .concat(chunk.files)
    //     .map((chunkFile) => publicPath + chunkFile);

    //   const css = chunkFiles
    //     .filter((chunkFile) => /.(css|scss)\.liquid($|\?)/.test(chunkFile))
    //     .map((chunkFile) => chunkFile.replace(/(\.css)?\.liquid$/, '.css'));

    //   assets.chunks[name].css = css;
    //   assets.css = assets.css.concat(css);
    // });
  }
}