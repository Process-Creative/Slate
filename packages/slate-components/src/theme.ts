import * as fs from 'fs';
import * as path from 'path';
import { fileGetThemeWorking } from './file';
import { Framework } from './framework';

const PACKAGE_SLATE2 = '@process-creative/slate-tools';
const PACKAGE_SLATE1_0 = '@shopify/slate'; 
const PACKAGE_PC_SLATE_TOOLS = '@process-creative/pc-slate-tools';

export type ThemeInfo = {
  framework:Framework;
};

export const themeGetInfo = (dir?:string) => {
  if(!dir) dir = fileGetThemeWorking();


  //Determine the framework first
  //Scan directory...
  const scan = fs.readdirSync(dir);

  //Has a package.json?
  let framework:Framework;
  let data:{[key:string]:string};

  if(scan.indexOf('package.json') === -1) {
    //Potentially themekit
    let isThemekit = [
      'layout', 'templates'
    ].every(required => scan.indexOf(required) !== -1);
    framework = isThemekit ? 'themekit' : null;
  } else {
    //Read the package json
    data = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'));
    
    //Read the deps
    let deps:{[key:string]:string} = {
      ...(data['dependencies'] as any || {}),
      ...(data['devDependencies'] as any || {})
    };

    if(deps[PACKAGE_SLATE2]) {
      framework = 'slatev2';
    } else if(deps[PACKAGE_SLATE1_0]) {
      let ver = deps[PACKAGE_SLATE1_0];
      framework = ver.indexOf('beta') ? 'slatev1' : 'slatev0';
    }
  }

  if(!framework) return null;

  //Now we know the framework we can learn some cool stuff
  const isProcess = ( data && data.dependencies &&
    data.dependencies[PACKAGE_PC_SLATE_TOOLS]
  );

  return {
    framework,
    isProcess
  }
}