import * as path from 'path';
import * as fs from 'fs';
import { TestResults } from "./Tester";
import { makeDirDeep, moveFile } from './Utils';
import {
  PATH_VIDEOS as PATH_CYPRESS_VIDEOS,
  PATH_SCREENSHOTS as PATH_CYPRESS_SCREENSHOTS
} from './CypressTester';

//Constants
export const PATH_OUTPUT = path.resolve('.', 'results');
export const PATH_VIDEOS = path.resolve(PATH_OUTPUT, 'videos');
export const PATH_SCREENSHOTS = path.resolve(PATH_OUTPUT, 'screenshots');

//Methods
export const saveResults = async (results:TestResults) => {
  results.cypress.videos.forEach(file => moveFile({
    file, to: PATH_VIDEOS, relative: PATH_CYPRESS_VIDEOS
  }));

  results.cypress.screenshots.forEach(file => moveFile({
    file, to: PATH_SCREENSHOTS, relative: PATH_CYPRESS_SCREENSHOTS
  }));

  //Make dirs
  [
    PATH_OUTPUT, PATH_VIDEOS, PATH_SCREENSHOTS
  ].forEach(p => makeDirDeep(PATH_OUTPUT));
}