import * as cypress from 'cypress';
import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { deepReadDir } from '../utils/FileUtils';
import { getThemePreviewUrl } from '../utils/ThemeUtils';
import { StandardTestParams } from './Tester';
import { CYPRESS_TESTS, CypressTest } from './CypressTests';

//Type Definitions
export type BrowserType = Parameters<(typeof cypress.run)>[0]['browser'];

export type CypressTestParams = StandardTestParams & {
  browser:BrowserType;
  tests?:CypressTest[];
};

export type CypressTestResult = {
  test:CypressTest;
  result:(CypressCommandLine.CypressRunResult|CypressCommandLine.CypressFailedRunResult);
}

//Paths
export const PATH_CYPRESS_PROJ = path.resolve(__dirname, '..', '..');
export const PATH_CYPRESS = path.resolve(PATH_CYPRESS_PROJ, 'cypress');
export const PATH_CYPRESS_VID = path.resolve(PATH_CYPRESS, 'videos');
export const PATH_CYPRESS_PIC = path.resolve(PATH_CYPRESS, 'screenshots');

//Methods
export const getRecordingVideos = ():string[] => {
  if(!fs.existsSync(PATH_CYPRESS_VID)) return [];
  return deepReadDir(PATH_CYPRESS_VID);
}

export const getRecordingScreenshots = ():string[] => {
  if(!fs.existsSync(PATH_CYPRESS_PIC)) return [];
  return deepReadDir(PATH_CYPRESS_PIC);
}

export const doCypressTest = async (params:CypressTestParams) => {
  const allResults:CypressTestResult[] = [];
  const tests = params.tests || CYPRESS_TESTS;

  for(let i = 0; i < tests.length; i++) {
    const test = tests[i];
    let result = await cypress.run({
      browser: params.browser,
      project: path.resolve(PATH_CYPRESS_PROJ),
      spec: path.join(PATH_CYPRESS_PROJ, 'cypress', 'integration', test),
      config: { baseUrl: getThemePreviewUrl(params) },
      configFile: false,
      headless: true,
      env: { ...params }
    });
    allResults.push({ test, result });
  }

  const videos = getRecordingVideos();
  const screenshots = getRecordingScreenshots();
  return { allResults, videos, screenshots };
}

export const doCypressTestCleanup = (params:CypressTestParams) => {
  //Cleanse these directories
  [
    PATH_CYPRESS_VID, PATH_CYPRESS_PIC,

    ...[
      'commands', 'support', 'plugins'
    ].map(p => path.resolve(PATH_CYPRESS, p))
  ].forEach(p => {
    if(!fs.existsSync(p)) return;
    rimraf.sync(p);
  });
}