const SlateConfig = require('@process-creative/slate-config');
const getLayoutEntrypoints = require('../utilities/get-layout-entrypoints');
const getTemplateEntrypoints = require('../utilities/get-template-entrypoints');
const schema = require('./../../../slate-tools.schema.js');
const config = new SlateConfig(schema);


module.exports = {
  entry: Object.assign(
    {},
    getLayoutEntrypoints(),
    getTemplateEntrypoints(),
    config.get('webpack.entrypoints'),
  ),
};
