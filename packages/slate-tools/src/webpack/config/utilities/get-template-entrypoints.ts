import * as path from 'path';
import { slateToolsConfig } from '../../../schema';
import { getEntryPoints } from './get-entrypoints';

export const getTemplateEntryPoints = () => getEntryPoints({
  liquidDir: slateToolsConfig.get('paths.theme.src.templates'),
  scriptsDir: path.join(slateToolsConfig.get('paths.theme.src.scripts'), 'templates'),
  entryType: 'templates'
});