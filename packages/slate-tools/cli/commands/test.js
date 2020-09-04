const { fullSiteTest } = require('@process-creative/slate-tester');
const { getSlateEnv, getThemePreviewUrl, validate } = require('@process-creative/slate-env');

(async () => {
  if(!validate().isValid) return console.error(`Invalid env!`);

  //Get the theme information
  const env = getSlateEnv();
  const baseUrl = getThemePreviewUrl(env);

  let results = await fullSiteTest({
    baseUrl,
    browser: 'chrome'
  });
})().catch(console.error);