import * as fs from 'fs';
import * as path from 'path';

export const makeDir = (dir:string) => {
  dir = path.resolve(dir);
  if(fs.existsSync(dir)) return;
  fs.mkdirSync(dir);
}

export const makeDirDeep = (dir:string) => {
  const bits = dir.split(path.sep);
  const parts = [];

  bits.forEach(b => {
    parts.push(b);
    makeDir(path.join(...parts));
  });
}

export const deepReadDir = (dir:string):string[] => {
  return fs.readdirSync(dir).reduce((x,entry) => {
    const entryPath = path.resolve(dir, entry);
    const stats = fs.statSync(entryPath);
    const entries = stats.isDirectory() ? deepReadDir(entryPath) : [ entryPath ];
    return [ ...x, ...entries ];
  }, []);
}

export const moveFile = ({ file, to, relative }:{file:string, to:string, relative?:string }) => {
  const fileName = path.basename(file);

  let toDir = path.resolve(to);
  if(relative) {
    const relativeSource = path.dirname(file).replace(path.resolve(relative), '');
    toDir = path.join(toDir, relativeSource);
  }

  makeDirDeep(toDir);

  const newFile = path.resolve(toDir, fileName);
  fs.renameSync(file, newFile);
}