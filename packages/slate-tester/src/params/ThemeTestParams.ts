import * as fs from 'fs';
import * as path from 'path';
import { FullSiteTestParams } from '..';
import { validate, getSlateEnv } from '@process-creative/slate-env';
import { prompt } from 'inquirer';
import * as  minimist from 'minimist';

export const PATH_THEME = path.resolve('.');
export const PATH_THEME_INFO_JS = path.resolve(PATH_THEME, 'slate-tester.js');
export const PATH_THEME_INFO_JSON = path.resolve(PATH_THEME, 'slate-tester.json');

export const getTestThemeParams = async () => {
  const argv = minimist(process.argv.slice(2));

  //Create params
  let params:FullSiteTestParams;

  //File based params
  if(fs.existsSync(PATH_THEME_INFO_JS)) {
    params = require(PATH_THEME_INFO_JS);
  } else if(fs.existsSync(PATH_THEME_INFO_JSON)) {
    params = JSON.parse(fs.readFileSync(PATH_THEME_INFO_JSON, 'utf8'));
  } else {
    params = { } as any;
  }

  params.skipCleanup = params.skipCleanup || argv['skipCleanup'];

  //Read defaults if necessary from args and/or slate env
  if(!params.theme && validate().isValid) {
    const env = getSlateEnv();
    params.theme = {
      shopName: env.SLATE_STORE,
      themeId: env.SLATE_THEME_ID
    };
  } else if(!params.theme) {
    params.theme = {
      shopName: argv['shopName'],
      themeId: argv['themeId']
    }
  }

  //Shop name CLI
  if(!params.theme.shopName) {
    const { shopName } = await prompt({
      type: 'input',
      name: 'shopName',
      message: 'Enter the shopName to test',
      validate: (inp) => inp && !!inp.replace(/\s/g, '').length
    }) as { shopName:string };
    params.theme.shopName = shopName;
  }

  //Theme ID CLI
  if(!params.theme.themeId) {
    const { themeId } = await prompt({
      type: 'input',
      name: 'themeId',
      message: 'Enter a theme id, or leave blank' 
    }) as { themeId?:string };
    params.theme.themeId = themeId;
  }

  return params;
}