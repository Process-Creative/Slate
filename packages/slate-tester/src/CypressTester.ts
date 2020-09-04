import * as cypress from 'cypress';
import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { deepReadDir } from './Utils';

//Type Definitions
export type BrowserType = Parameters<(typeof cypress.run)>[0]['browser'];

export type CypressTestParams = {
  baseUrl:string;
  browser:BrowserType;
}

//Paths
export const PATH_PROJECT = path.resolve(__dirname, '..');
export const PATH_CYPRESS = path.resolve(PATH_PROJECT, 'cypress');
export const PATH_VIDEOS = path.resolve(PATH_CYPRESS, 'videos');
export const PATH_SCREENSHOTS = path.resolve(PATH_CYPRESS, 'screenshots');

//Methods
export const getRecordingVideos = ():string[] => {
  if(!fs.existsSync(PATH_VIDEOS)) return [];
  return deepReadDir(PATH_VIDEOS);
}

export const getRecordingScreenshots = ():string[] => {
  if(!fs.existsSync(PATH_SCREENSHOTS)) return [];
  return deepReadDir(PATH_SCREENSHOTS);
}

export const doCypressTest = async (params:CypressTestParams) => {
  const results = await cypress.run({
    browser: params.browser,
    project: path.resolve(PATH_PROJECT),
    config: { baseUrl: params.baseUrl },
    configFile: false,
    headless: true,
    env: { ...params }
  });

  const videos = getRecordingVideos();
  const screenshots = getRecordingScreenshots();

  return { results, videos, screenshots };
}

export const doCypressTestCleanup = (params:CypressTestParams) => {
  //Cleanse these directories
  [
    PATH_VIDEOS, PATH_SCREENSHOTS,

    ...[
      'commands', 'support', 'plugins'
    ].map(p => path.resolve(PATH_CYPRESS, p))
  ].forEach(p => {
    if(!fs.existsSync(p)) return;
    rimraf.sync(p);
  });
}