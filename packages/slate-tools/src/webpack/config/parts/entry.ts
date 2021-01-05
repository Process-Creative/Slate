import SlateConfig from '@process-creative/slate-config';
import { getLayoutEntryPoints } from '../utilities/get-layout-entrypoints';
import { getTemplateEntryPoints } from '../utilities/get-template-entrypoints';
import schema from './../../../slate-tools.schema';
const config = new SlateConfig(schema);

export const partsEntry = {
  entry: Object.assign(
    {},
    getLayoutEntryPoints(),
    getTemplateEntryPoints(),
    config.get('webpack.entrypoints'),
  ),
};
