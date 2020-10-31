import * as program from 'commander';
import { fileGetSchemaFile, fileWriteSchema } from '../file';
import { frameworkValidate } from '../framework';
import { schemaCreate, schemaValidateName } from '../schema';

program
  .command('create <name>')
  .description('Creates a new component')
  .action((name:string) => {
    //Validate framework and name
    if(!schemaValidateName(name)) {
      return console.error(`Invalid name \"${name}\".`);
    }

    //Create a schema
    const schema = schemaCreate({ name });

    //Write schema
    fileWriteSchema(schema);
    const file = fileGetSchemaFile(schema);
    console.log(`Schema file has been written to ${file}`);
  })
;