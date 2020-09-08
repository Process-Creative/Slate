import * as path from 'path';
import * as fs from 'fs';
import { TestResults } from "./tester/Tester";
import { makeDirDeep, moveFile } from './utils/FileUtils';
import {
  PATH_CYPRESS_VID,
  PATH_CYPRESS_PIC
} from './tester/CypressTester';

//Constants
const PATH_RESULTS_OUT = path.resolve('.', 'results');
const PATH_RESULTS_VID = path.resolve(PATH_RESULTS_OUT, 'videos');
const PATH_RESULTS_PIC = path.resolve(PATH_RESULTS_OUT, 'screenshots');

//Methods
export const saveResults = async (results:TestResults) => {
  results.cypress.videos.forEach(file => moveFile({
    file, to: PATH_RESULTS_VID, relative: PATH_CYPRESS_VID
  }));

  results.cypress.screenshots.forEach(file => moveFile({
    file, to: PATH_RESULTS_PIC, relative: PATH_CYPRESS_PIC
  }));

  //Make dirs
  [
    PATH_RESULTS_OUT, PATH_RESULTS_VID, PATH_RESULTS_PIC
  ].forEach(p => makeDirDeep(PATH_RESULTS_OUT));
}