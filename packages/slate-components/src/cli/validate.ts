import * as program from 'commander';
import { fileGetSchemaFile, fileWriteSchema } from '../file';
import { frameworkValidate } from '../framework';
import { LoadedSchema, schemaCreate, schemaLoadTree, schemaValidate, schemaValidateName } from '../schema';

program
  .command('validate <name>')
  .description('Validates a component and all of its children')
  .action((name:string) => {
    //Validate framework and name
    if(!schemaValidateName(name)) {
      return console.error(`Invalid name \"${name}\".`);
    }

    const rootSchema = schemaLoadTree({ name });
    if(!rootSchema) {
      console.error(`Failed to validate \"${name}\", schema could not load.`);
      return;
    }

    const checkedSchemas:{[key:string]:boolean} = {};
    const validateSchema = (schema:LoadedSchema) => {
      if(checkedSchemas[schema.name]) return checkedSchemas[schema.name];

      const validateResult = schemaValidate(schema);
      if(validateResult === true) {
        checkedSchemas[schema.name] = true;
      } else {
        checkedSchemas[schema.name] = false;
        console.error(`Failed to validate schema \"${schema.name}\"`);
        console.error(validateResult);
        return false;
      }

      return schema.loadedDeps.every(sub => validateSchema(sub));
    };

    if(!validateSchema(rootSchema)) return;
    console.log(`Schema validated successfully.`);
  })
;