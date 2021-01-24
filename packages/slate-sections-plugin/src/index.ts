import { promises as fs } from 'fs';
import * as path from 'path';
import { RawSource } from 'webpack-sources';

const PLUGIN_NAME = 'Slate Sections Plugin';

type SlateSectionsPluginOptions = {
  from?:string;
  to?:string;
}

export class SlateSectionsPlugin {
  public options:SlateSectionsPluginOptions;

  constructor(options:SlateSectionsPluginOptions = {}) {
    this.options = this._validateOptions(options);
  }

  apply(compiler:any) {
    compiler.hooks.emit.tapPromise(PLUGIN_NAME, this.addLocales.bind(this));
  }

  async addFile({ compilation, compilationOutput, filePath, file }:any) {
    const source = path.resolve(filePath, file);
    const outputKey = this._getOutputKey(source, compilationOutput);
    compilation.assets[outputKey] = await this._getLiquidSource(source);
  }

  addFiles(params:any) {
    const { files, filePath } = params;

    return Promise.all(files.map(async file => {
      const absFile = path.resolve(filePath, file);
      const fileStat = await fs.stat(absFile);

      if (fileStat.isDirectory()) {
        const filesRaw = await fs.readdir(absFile, { withFileTypes: true });
        const dirFiles = filesRaw.map(f => f.name);
        return this.addFiles({ ...params, files: dirFiles, filePath: absFile });
      }

      return await this.addFile({ ...params, file });
    }));
  }

  async addLocales(compilation:any) {
    const files = await fs.readdir(this.options.from);
    const compilationOutput = compilation.compiler.outputPath;

    // Add sections folder to webpack context
    compilation.contextDependencies.add(this.options.from);

    return await this.addFiles({
      compilation, compilationOutput, files,
      filePath: path.resolve(this.options.from)
    });
  }

  _validateOptions(options:SlateSectionsPluginOptions) {
    if (!options.hasOwnProperty('from') || typeof options.from !== 'string') {
      throw TypeError('Missing or Invalid From Option');
    }
    if (!options.hasOwnProperty('to') || typeof options.to !== 'string') {
      throw TypeError('Missing or Invalid To Option');
    }

    return options;
  }

  /**
   * Returns the filename of the file to be created within the dist directory.
   *
   * @param {string} relativePathFromSections The relative path from the source sections directory
   * @returns The output file name of the liquid file.
   */
  _getOutputFileName(relativePathFromSections:string) {
    return path.basename(relativePathFromSections);
  }

  /**
   * In order to output to the correct location in the dist folder based on their slate.config we
   * must get a relative path from the webpack output path that is set
   *
   * @param {string} liquidSourcePath // Absolute path to the source liquid file
   * @param {Compilation} compilationOutput // Output path set for webpack
   * @returns The key thats needed to provide the Compilation object the correct location to output
   * Sources
   */
  _getOutputKey(liquidSourcePath:string, compilationOutput:any) {
    const relativePathFromSections = path.relative(
      this.options.from,
      liquidSourcePath,
    );

    const fileName = this._getOutputFileName(relativePathFromSections);

    // The relative path from the output set in webpack, to the specified output for sections in slate config
    const relativeOutputPath = path.relative(
      compilationOutput,
      this.options.to,
    );

    return path.join(relativeOutputPath, fileName);
  }

  /**
   * Reads file and creates a source object
   *
   * @param {*} sourcePath Absolute path to liquid file
   * @returns RawSource object with the contents of the file
   */
  async _getLiquidSource(sourcePath:string) {
    const liquidContent = await fs.readFile(sourcePath, 'utf-8');
    return new RawSource(liquidContent);
  }
};
