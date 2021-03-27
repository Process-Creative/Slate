import { SchemaPaths, SCHEMA_PATHS, slateConfigCreate, slateSchemaCreate } from '@process-creative/slate-config';

export type SchemaSync = SchemaPaths & {
}

export const SCHEMA_SYNC = slateSchemaCreate<SchemaSync>(config => ({
  ...SCHEMA_PATHS(config)
}));

export const config = slateConfigCreate(SCHEMA_SYNC);