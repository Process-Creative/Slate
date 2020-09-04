const { getSlateEnv, getThemePreviewUrl } = require('@process-creative/slate-env');
const open = require('open');

(async () => {
  const env = getSlateEnv();
  const url = getThemePreviewUrl(env);
  
  console.log(`Opening ${url}`);
  await open(url);
})().catch(console.error);