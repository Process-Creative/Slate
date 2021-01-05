import * as path from 'path';
import slateToolsSchema from '../../../slate-tools.schema';
import SlateConfig from '@process-creative/slate-config';
import { getEntryPoints } from './get-entrypoints';
const config = new SlateConfig(slateToolsSchema);


export const getTemplateEntryPoints = () => getEntryPoints({
  liquidDir: config.get('paths.theme.src.templates'),
  scriptsDir: path.join(config.get('paths.theme.src.scripts'), 'templates'),
  entryType: 'templates'
});