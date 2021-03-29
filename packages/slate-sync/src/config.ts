import { SCHEMA_PATHS, slateConfigCreate, slateSchemaCreate } from '@process-creative/slate-config';
import { SchemaEnv, SCHEMA_ENV } from '@process-creative/slate-env';

export type SchemaSync = SchemaEnv & {
}

export const SCHEMA_SYNC = slateSchemaCreate<SchemaSync>(config => ({
  ...SCHEMA_ENV(config)
}));

export const config = slateConfigCreate(SCHEMA_SYNC);