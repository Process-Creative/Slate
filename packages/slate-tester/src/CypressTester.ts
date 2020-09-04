import * as cypress from 'cypress';
import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

//Type Definitions
export type BrowserType = Parameters<(typeof cypress.run)>[0]['browser'];
export interface SiteTestParams {
  baseUrl:string;
  browser:BrowserType
};

//Paths
const PATH_PROJECT = path.resolve(__dirname);
const PATH_CYPRESS = path.resolve(PATH_PROJECT, 'cypress');
const PATH_VIDEOS = path.resolve(PATH_CYPRESS, 'videos');
const PATH_SCREENSHOTS = path.resolve(PATH_CYPRESS, 'screenshots');

//Methods
export const getRecordingVideos = ():string[] => {
  if(!fs.existsSync(PATH_VIDEOS)) return [];
  return fs.readdirSync(PATH_VIDEOS).map(vid => path.resolve(PATH_VIDEOS, vid));
}

export const getRecordingScreenshots = ():string[] => {
  if(!fs.existsSync(PATH_SCREENSHOTS)) return [];
  return fs.readdirSync(PATH_SCREENSHOTS).map(sc => path.resolve(PATH_SCREENSHOTS, sc));
}

export const doSiteTest = async (params:SiteTestParams) => {
  const results = await cypress.run({
    browser: params.browser,
    project: path.resolve(PATH_PROJECT),
    config: { baseUrl: params.baseUrl },
    configFile: false,
    headless: true,
    env: {
      ...params
    }
  });

  const videos = getRecordingVideos();
  const screenshots = getRecordingScreenshots();

  return {
    results, videos, screenshots
  }
}

export const doSiteTestCleanup = () => {
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