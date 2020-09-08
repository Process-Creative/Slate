import { doCypressTestCleanup, doCypressTest, BrowserType, CypressTestParams } from './CypressTester';
import { PromiseType } from 'utility-types';
import { saveResults } from './../Results';
import { SlateTheme } from '../utils/ThemeUtils';

//Type Definitions
export type SlateSiteInfo = {
  testProducts:string[];
};

export type StandardTestParams = {
  theme:SlateTheme;
  siteInformation:SlateSiteInfo;
};

export type FullSiteTestParams = (
  CypressTestParams
);

export type TestResults = PromiseType<ReturnType<typeof fullSiteTest>>;

//Methods
export const fullSiteTest = async (params:FullSiteTestParams) => {
  console.log('Starting Site Tests with the following parameters;', params);
  
  //Cleanup
  await cleanupSiteTest(params);

  //Do tests
  console.log('Running Cypress Site Tests...');
  const cypress = await doCypressTest(params);

  //Results
  const results = { cypress };

  //Save results
  console.log('Saving Results...');
  await saveResults(results)

  //Cleanup
  console.log('Cleaning Up...');
  await cleanupSiteTest(params);

  return results;
}

export const cleanupSiteTest = async (params:FullSiteTestParams) => {
  doCypressTestCleanup(params);
}
