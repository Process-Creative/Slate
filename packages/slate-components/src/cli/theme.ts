import * as program from 'commander';
import { themeGetInfo } from '../theme';

program
  .command('theme')
  .description('Prints some information about the current theme')
  .action(() => {
    const theme = themeGetInfo();
    if(!theme) return console.error(`Failed to determine theme info.`);

    const t = '  ';
  
    console.log(`\n = = = Theme Information = = =`);
    console.log(t+`Process Creative Theme: ${theme.isProcess ? 'yes' : 'no'}`);
    console.log(t+`Framework: ${theme.framework}`);

    console.log('');
  })
;