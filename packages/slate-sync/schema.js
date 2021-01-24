const { slateSchemaCreate, slateConfigCreate, SCHEMA_PATHS } = require("@process-creative/slate-config");

const SCHEMA_SYNC = slateSchemaCreate(config => ({
  ...SCHEMA_PATHS(config)
}));

const config = slateConfigCreate(SCHEMA_SYNC)

module.exports = {
  SCHEMA_SYNC, config
}