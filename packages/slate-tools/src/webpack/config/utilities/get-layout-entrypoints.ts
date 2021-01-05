import * as path from 'path';
import slateToolsSchema from '../../../slate-tools.schema';
import SlateConfig from '@process-creative/slate-config';
import { getEntryPoints } from './get-entrypoints';
const config = new SlateConfig(slateToolsSchema);

export const getLayoutEntryPoints = () => getEntryPoints({
  liquidDir: config.get('paths.theme.src.layout'),
  scriptsDir: path.join(config.get('paths.theme.src.scripts'), 'layout'),
  entryType: 'layout'
});