import { download } from "../../shopify/sync";
import { webpackBuild } from "../../webpack/build";
import * as path from 'path';
import * as fs from 'fs';
import { slateToolsConfig } from './../../schema';

(async () => {
  console.log(`Building theme...`);
  await webpackBuild();
  console.log('Downloading production...');
  await download();

  console.log('Comparing files...');

  const leftOnly:string[] = [];
  const changes:string[] = [];
  const rightOnly:string[] = [];

  const traverse = (pathLeft:string, pathRight:string) => {
    // Scan each dir
    const leftFiles = fs.readdirSync(pathLeft);
    const rightFiles = fs.readdirSync(pathRight);
    
    const inBoth:string[] = [];

    // Find the files that are in LEFT but not in RIGHT
    leftFiles.forEach(left => {
      if(rightFiles.indexOf(left) !== -1) {
        inBoth.push(left);
        return;
      }

      leftOnly.push(path.join(pathLeft, left));
    });

    // Find in RIGHT but not LEFT
    rightFiles.forEach(right => {
      if(inBoth.indexOf(right) !== -1) return;
      rightOnly.push(path.join(pathRight, right));
    });

    // For the in both, are they samey?
    inBoth.forEach(file => {
      const pathLeftFull = path.join(pathLeft, file);
      const pathRightFull = path.join(pathRight, file);

      const statLeft = fs.statSync(pathLeftFull);
      if(statLeft.isDirectory()) {
        traverse(pathLeftFull, pathRightFull);
        return;
      }

      const strLeft = fs.readFileSync(pathLeftFull);
      const strRight = fs.readFileSync(pathRightFull);
      if(strLeft === strRight) return;

      changes.push(pathLeftFull);
    });
  };

  traverse(
    slateToolsConfig.get('paths.theme.dist'), 
    slateToolsConfig.get('paths.theme.download')
  );

  const cleanse = (s:string[], prefix:string) => {
    const p = path.join(prefix);
    s.forEach((str,i) => {
      s[i] = str.substr(p.length);
    });
    return s;
  }
  
  const pathOut = slateToolsConfig.get('paths.theme');
  const pathOutFile = path.join(pathOut, 'Slate Compare Results.json');
  fs.writeFileSync(pathOutFile, JSON.stringify({
    leftOnly: cleanse(leftOnly, slateToolsConfig.get('paths.theme.dist')),
    changes: cleanse(changes, pathOut),
    rightOnly: cleanse(rightOnly, slateToolsConfig.get('paths.theme.download'))
  }, null, 2));
})().catch(console.error);