import { fullSiteTest } from "../tester/Tester";
import { getTestThemeParams } from "../params/ThemeTestParams";
(async () => {
  let params = await getTestThemeParams();
  let results = await fullSiteTest(params);

  process.exit(0);
})().catch(console.error);