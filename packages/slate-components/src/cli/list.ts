import * as program from 'commander';
import { fileGetAllComponents, fileGetSchemaPath, fileReadSchema } from '../file';
import { schemaValidateName } from '../schema';
import * as open from 'open';

program
  .command('list')
  .description('Lists all Slate Components.')
  .action((name:string) => {
    const components = fileGetAllComponents();
    console.log(`Tracking ${components.length} components:`);
    console.log(components.map(c => '  - '+c).join('\n'));
  })
;