import open from 'open';
import { getSlateEnv } from '../../env/env';
import { getThemePreviewUrl } from '../../env/utils';

(async () => {
  const env = getSlateEnv();
  const url = getThemePreviewUrl(env);
  
  console.log(`Opening ${url}`);
  await open(url);
})().catch(console.error);