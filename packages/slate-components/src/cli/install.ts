import * as program from 'commander';
import { fileGetSchemaPath, fileReadSchema, fileCopy } from '../file';
import { schemaGetFrameworkCompatibility, schemaLoadTree, schemaTreeGetFiles, schemaValidateName } from '../schema';
import * as open from 'open';
import { themeGetInfo } from '../theme';
import * as inquirer from 'inquirer';

program
  .command('install <name>')
  .description('Installs a component onto a theme')
  .action(async (name:string) => {
    //Validate framework and name
    if(!schemaValidateName(name)) {
      return console.error(`Invalid name \"${name}\".`);
    };

    //Get info about the current theme
    const theme = themeGetInfo();
    if(!theme) return console.error(`Could not determine theme type.`);

    //Load the deps tree
    const tree = schemaLoadTree({ name });

    //Now verify which envs are compatible
    // const compatible = schemaGetFrameworkCompatibility(tree);
    // if(compatible.indexOf(theme.framework) === -1) {
    //   let e = `The component ${tree.name}, or one of its dependencies is not `;
    //   e += `compatible with ${theme.framework}.`;
    //   return console.error(e);
    // }

    //Compatible, get files and ensure user is cool
    const { files, root } = schemaTreeGetFiles(tree);
    const message = `You are about to install ${files.length} files into ` +
      `your current theme. There is no undo for this operation. Continue?`
    ;
    let { install } = await inquirer.prompt([
      { type: 'confirm', name: 'install', message }
    ]);
    if(!install) return;

    fileCopy({
      root, files, theme,
      onFile: (p) => {
        const strSource = p.source.replace(p.sourceRoot, '');
        const strDest = p.dest.replace(p.destRoot, '');
        console.log(`${strSource} => ${strDest}`);
      }
    })
  })
;