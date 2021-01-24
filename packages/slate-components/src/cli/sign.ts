import * as program from 'commander';
import { fileReadSchema, fileWriteSignature } from '../file';
import { schemaGetAll, schemaLoadTree, schemaTreeGetFiles, schemaValidate } from '../schema';
program
  .command('sign')
  .description('Validates and signs all components.')
  .action((name:string) => {
    const allSchemas = schemaGetAll().map(si => fileReadSchema(si));

    allSchemas.every(schema => {
      console.log(`Validating ${schema.name}`);
      const validated = schemaValidate(schema);
      if(validated !== true) {
        console.error(`Failed to validate schema \"${schema.name}\"`);
        console.error(validated);
        return false;
      }

      console.log(`Signing ${schema.name}`);

      const tree = schemaLoadTree(schema);
      const files = schemaTreeGetFiles(tree);

      //Generate a signature
      let signature = [
        `This file was automatically generated at ${new Date().toISOString()}.`,
        `# ${schema.name}`, '',
        `Version: ${schema.version}`, '',
        schema.description || 'No description provided.', '',

        '---',

        `Compatible with:`,
        schema.compatible.map(t => ' - ' + t).join('\n'),

        '---',

        'Directly Depends On:',
        '```', schema.deps.map(d => ' - ' + d).join('\n'), '```',

        '---',
        
        'Depended On By:',
        '```',
        allSchemas
          .filter(sch => sch.deps.indexOf(schema.name) !== -1)
          .map(s => ' - ' + s.name)
          .join('\n'),
        '```',

        '---',

        'Files (Including Dependencies)', '',
        '```',
        files.files.sort().map(t => ' - '+t).join('\n'),
        '```'
      ].join('\n');

      fileWriteSignature({ schema, signature });

      return true;
    });
  })
;