import * as path from 'path';
import { slateToolsConfig } from '../../../schema';
import { getEntryPoints } from './get-entrypoints';

export const getLayoutEntryPoints = () => getEntryPoints({
  liquidDir: slateToolsConfig.get('paths.theme.src.layout'),
  scriptsDir: path.join(slateToolsConfig.get('paths.theme.src.scripts'), 'layout'),
  entryType: 'layout'
});