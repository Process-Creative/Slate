import { slateToolsConfig } from '../../../schema';
import { getLayoutEntryPoints } from '../utilities/get-layout-entrypoints';
import { getTemplateEntryPoints } from '../utilities/get-template-entrypoints';

export const partEntry = {
  entry: Object.assign(
    {},
    getLayoutEntryPoints(),
    getTemplateEntryPoints(),
    slateToolsConfig.get('webpack.entrypoints'),
  ),
};
