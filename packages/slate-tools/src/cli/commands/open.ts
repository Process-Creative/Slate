import open from 'open';
import { getSlateEnv } from '../../config/env';
import { getThemePreviewUrl } from '../../config/utils';

(async () => {
  const env = getSlateEnv();
  const url = getThemePreviewUrl(env);
  
  console.log(`Opening ${url}`);
  await open(url);
})().catch(console.error);