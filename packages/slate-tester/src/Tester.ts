import { doCypressTestCleanup, doCypressTest, BrowserType, CypressTestParams } from './CypressTester';
import { PromiseType } from 'utility-types';
import { saveResults } from './Results';

//Type Definitions
export type SiteTestParams = (
  CypressTestParams
);

export type TestResults = PromiseType<ReturnType<typeof fullSiteTest>>;

//Methods
export const fullSiteTest = async (params:SiteTestParams) => {
  console.log('Starting Site Tests...');
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

export const cleanupSiteTest = async (params:SiteTestParams) => {
  doCypressTestCleanup(params);
}
