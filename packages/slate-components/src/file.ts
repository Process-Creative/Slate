import * as path from 'path';
import * as fs from 'fs';
import { Schema, SchemaIdentifier } from "./schema";
import { Framework, frameworkGetOldest, FRAMEWORKS } from "./framework";
import { exists } from 'fs';
import { ThemeInfo } from './theme';

//Constants
export const PATH_COMPONENTS = path.resolve(__dirname, '..', 'components');
const FILE_SCHEMA = 'schema.json';
const PATH_OUTPUT = path.resolve('.');

export const PATH_COMPONENT_PARTS = [
  'assets', 'scripts', 'styles', 'snippets', 'sections', 'templates', 'locales',
  'layouts', 'config'
]

//Methods

export const fileGetSchemaPath = (schema:SchemaIdentifier|Schema) => {
  return path.join(PATH_COMPONENTS, schema.name);
}

export const fileGetSchemaFile = (schema:SchemaIdentifier) => {
  const dir = fileGetSchemaPath(schema);
  return path.join(dir, FILE_SCHEMA);
}

export const fileWriteSchema = (schema:Schema) => {
  const dir = fileGetSchemaPath(schema);
  const file = fileGetSchemaFile(schema);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(schema, null, 2));
}

export const fileReadSchema = (schema:SchemaIdentifier) => {
  const file = fileGetSchemaFile(schema);
  if(!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf-8')) as Schema;
}

type SearchIdentifiersParams = {
  filter?:(params:{ dirName:string, dir:string, stats:fs.Stats })=>boolean
}
export const fileSearchIdentifiers = (params?:SearchIdentifiersParams) => {
  let filter = params && params.filter ? params.filter : ()=>true

  //Scan dir
  return fs.readdirSync(PATH_COMPONENTS).map(dirName => {
    const dir = path.join(PATH_COMPONENTS, dirName);
    const stats = fs.statSync(dir);
    return { dir, stats, dirName };
  }).filter(info => {
    if(!info.stats.isDirectory) return false;
    return filter(info)
  }).map(t => {
    return { name: t.dirName } as SchemaIdentifier
  });
}

export const fileGetThemeWorking = () => PATH_OUTPUT;

export const fileGetSchemaContents = (schema:Schema) => {
  const getFiles = (params:{ root:string, subPaths:string[] }) => {
    const files:string[] = [];
    params.subPaths.forEach(sub => {
      const dir = path.join(params.root, sub);
      if(!fs.existsSync(dir)) return;
      const stat = fs.statSync(dir);

      //Directory? Recurse
      if(stat.isDirectory()) {
        const scan = fs.readdirSync(dir);
        files.push(...getFiles({ root: dir, subPaths: scan }));
        return;
      }

      files.push(dir);
    });
    return files;
  }

  //Find parts
  const root = fileGetSchemaPath(schema);
  return {
    root,
    files:  getFiles({ root, subPaths: PATH_COMPONENT_PARTS })
  };
}

export const fileGetThemeOutputDirectory = (theme:ThemeInfo) => {
  if(theme.framework === 'themekit') return path.resolve(PATH_OUTPUT);
  return path.resolve(PATH_OUTPUT, 'src');
}

type CopyParams = {
  root:string, files:string[], theme:ThemeInfo,
  onFile?:(p:{
    sourceRoot:string, source:string, dest:string, destRoot:string
  }) => void 
};
export const filesCopy = (params:CopyParams) => {
  const destRoot = fileGetThemeOutputDirectory(params.theme);
  params.files.forEach(file => {
    const source = path.join(params.root, file);

    //"file" is currently something like some-component/assets/something.png
    const actualOut = file.split(path.sep).filter(t => t);
    actualOut.shift();//Remove the some-component
    const dest = path.join(destRoot, ...actualOut);

    //Make dir
    const destDir = path.dirname(dest);
    fs.mkdirSync(destDir, { recursive: true });
    
    //Do callback
    fs.copyFileSync(source, dest);
    params.onFile({ sourceRoot: params.root, source, dest, destRoot });
  })
}