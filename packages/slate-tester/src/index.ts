import { doSiteTest, doSiteTestCleanup } from './CypressTester'; 

(async () => {
  //Cleanup any residule stuff
  doSiteTestCleanup();

  //Perform the test
  // let test = await doSiteTest({
  //   baseUrl: '',
  //   browser: 'chrome'
  // });

  //Cleanup
  doSiteTestCleanup();
})().catch(console.error);