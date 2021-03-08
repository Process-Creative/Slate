import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';
import chalk from 'chalk';
import { slateToolsConfig } from './../../schema';

/**
 * Builds a zip based on an array of directories and files. This
 * script is used for shipit and should not be called explicitly.
 */

const zipName = (
  fs.existsSync(slateToolsConfig.get('paths.theme.packageJson'))
  ? require(slateToolsConfig.get('paths.theme.packageJson')).name
  : 'theme-zip'
).split('/').pop();
const zipPath = getZipPath(slateToolsConfig.get('paths.theme'), zipName, 'zip');
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip');

if (!fs.existsSync(slateToolsConfig.get('paths.theme.dist'))) {
  console.log(
    chalk.red(
      `${slateToolsConfig.get('paths.theme.dist')} was not found. \n` +
        'Please run the Slate Build script before running Slate Zip',
    ),
  );

  process.exit();
}

output.on('close', () => {
  console.log(`${path.basename(zipPath)}: ${archive.pointer()} total bytes`);
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.log(err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(slateToolsConfig.get('paths.theme.dist'), '/');
archive.finalize();

function getZipPath(dir: string, name: string, ext: string) {
  const proposedPath = path.resolve(dir, `${name}.${ext}`);
  if (!fs.existsSync(proposedPath)) {
    return proposedPath;
  }

  for (let i = 1; ; i++) {
    const tryPath = path.resolve(dir, `${name} (${i}).${ext}`);

    if (!fs.existsSync(tryPath)) {
      return tryPath;
    }
  }
}
