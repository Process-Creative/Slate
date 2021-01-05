const SlateConfig = require('@process-creative/slate-config');
const { getLayoutEntryPoints } = require('../utilities/get-layout-entrypoints');
const { getTemplateEntryPoints } = require('../utilities/get-template-entrypoints');
const schema = require('./../../../slate-tools.schema.js');
const config = new SlateConfig(schema);


module.exports = {
  entry: Object.assign(
    {},
    getLayoutEntryPoints(),
    getTemplateEntryPoints(),
    config.get('webpack.entrypoints'),
  ),
};
