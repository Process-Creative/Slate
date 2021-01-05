import * as fs from 'fs';
import * as path from 'path';

type GetEntryPointsParams = {
  liquidDir:string
  scriptsDir:string;
  entryType:'layout'|'templates'
}
export const getEntryPoints = (params:GetEntryPointsParams) => {
  const { liquidDir, scriptsDir, entryType } = params;
  const entries = {};

  //Scan the liquid directory for liquid files
  fs.readdirSync(liquidDir).forEach(file => {
    const { name } = path.parse(file);

    //If dir, subcheck and add to our entries.
    const stats = fs.statSync(path.join(liquidDir, file));
    if(stats.isDirectory()) {
      const dirEntries = getEntryPoints({
        liquidDir: path.join(liquidDir, file),
        scriptsDir: path.join(scriptsDir, file),
        entryType
      });

      Object.entries(dirEntries).forEach(([key, value]) => {
       entries[key] = value;
      })
    }

    //Find relative Script file
    [ 'js', 'ts', 'jsx', 'tsx' ].some(ext => {
      const filePath = path.join(scriptsDir, `${name}.${ext}`);
      if(!fs.existsSync(filePath)) return false;
      entries[`${entryType}.${name}`] = filePath;
      return true;
    });
  });

  return entries;
}