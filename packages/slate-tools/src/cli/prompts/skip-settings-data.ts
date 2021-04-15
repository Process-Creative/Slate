import chalk from'chalk';
import inquirer from 'inquirer';
import figures from 'figures';
import minimatch from 'minimatch';
import { argv } from 'yargs';
import { slateToolsConfig } from './../../schema';
import { getIgnoreFilesValue } from '../../env/value';

const question = {
  type: 'confirm',
  name: 'ignoreSettingsData',
  message: ' Skip uploading settings_data.json?',
  default: false,
};

const includesSettingsData = (files:string[]) => (
  files.filter(file => file.endsWith('settings_data.json')).length > 0
);

const filterIgnoredFiles = (files:string[]) => {
  const envIgnoreGlobs = getIgnoreFilesValue().split(':');
  const y = envIgnoreGlobs.map(glob => {
    if(glob[0] !== '/') glob = `/${glob}`;
    return files.filter(minimatch.filter(glob));
  });

  type T = string|T[];
  const rdce = (x:T[]) => x.reduce((x,y) => [ ...x,
    ...(Array.isArray(y) ? rdce(y) : [y])
  ], []);
  return rdce(y);
}

export const promptSkipSettingsData = async (files:string[]) => {
  const ignoredFiles = filterIgnoredFiles(files);

  if (
    includesSettingsData(ignoredFiles) ||
    !includesSettingsData(files) ||
    !slateToolsConfig.get('cli.promptSettings') ||
    argv.skipPrompts
  ) {
    return Promise.resolve(question.default);
  }

  console.log(
    `\n${chalk.yellow(
      figures.warning,
    )}  It looks like you are about to upload the ${chalk.bold(
      'settings_data.json',
    )} file.\n` +
      `   This can reset any theme setting customizations you have done in the\n` +
      `   Theme Editor. To always ignore uploading ${chalk.bold(
        'settings_data.json',
      )}, add the\n` +
      `   following to your ${chalk.bold('.env')} file: \n`,
  );
  console.log(
    `${chalk.cyan('      SLATE_IGNORE_FILES=/config/settings_data.json')}\n`,
  );
  console.log(
    `   Or to disable this prompt, add the following to your slate.config.js file:\n`,
  );
  console.log(`      ${chalk.cyan(`'cli.promptSettings': false`)}\n`);

  const answer = await inquirer.prompt([question]);

  return answer.ignoreSettingsData;
};
