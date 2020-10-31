import * as program from 'commander';
import { fileGetSchemaPath, fileReadSchema } from '../file';
import { schemaValidateName } from '../schema';
import * as open from 'open';

program
  .command('edit <name>')
  .description('Edits an existing component')
  .action((name:string) => {
    //Validate framework and name
    if(!schemaValidateName(name)) {
      return console.error(`Invalid name \"${name}\".`);
    }

    const schema = fileReadSchema({ name });
    if(!schema) return console.error(`Failed to load schema \"${name}\".`);

    const dir = fileGetSchemaPath(schema);
    open(dir);
    console.log(`Opening ${dir}`);
  })
;