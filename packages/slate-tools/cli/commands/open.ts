import { getSlateEnv, getThemePreviewUrl } from '@process-creative/slate-env';
import open from 'open';

(async () => {
  const env = getSlateEnv();
  const url = getThemePreviewUrl(env);
  
  console.log(`Opening ${url}`);
  await open(url);
})().catch(console.error);