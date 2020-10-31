import { fileGetSchemaContents, fileReadSchema, PATH_COMPONENTS } from "./file";
import { Framework } from "./framework";

export type SchemaIdentifier = {
  name:string;
}

export type Schema = SchemaIdentifier & {
  compatible:Framework[];
  version:string;
  deps:string[];
  scripts:string[];
};

export type LoadedSchema = Schema & {
  loadedDeps:LoadedSchema[]
};

type SchemaCreateParams = Partial<Schema> & SchemaIdentifier;
export const schemaCreate = (params:SchemaCreateParams) => ({
  version: '1.0.0',
  compatible: [],
  deps: [],
  scripts: [],
  
  ...params
});

export const schemaValidateName = (name:string) => {
  if(!name || !name.trim().length) return false;
  return name.replace(/\s/g, '').length === name.length;
};

export const schemaLoadTree = (root:SchemaIdentifier) => {
  //Create a cache for loaded schemas. This is "similar" to a yarn.lock file
  const lock:{[key:string]:LoadedSchema} = {};

  const loadAndCache = (schema:SchemaIdentifier) => {
    if(lock[schema.name]) return lock[schema.name];//Already loaded?

    //Load
    const s = fileReadSchema(schema);
    if(!s) throw new Error(`Failed to load schema ${schema}.`);
    const cached = { ...s, loadedDeps: [] } as LoadedSchema;
    
    //Recursively load and update into ourselves, cache first so that we can 
    //not stack overflow
    lock[schema.name] = cached;//Cache (this is by refererence)
    cached.loadedDeps = cached.deps.map(name => loadAndCache({ name }));
    return cached;
  }

  //Start recursively loading the root
  return loadAndCache(root);
}

export const schemaGetFrameworkCompatibility = (schema:LoadedSchema) => {
  const map:{[key:string]:Framework[]} = {};
  const supported = [ ...schema.compatible ];

  const checkSchema = (s:LoadedSchema) => {
    if(map[s.name]) return;//No recurse
    map[s.name] = s.compatible;
    
    //Remove versions we don't support
    supported.filter(sup => s.compatible.indexOf(sup) !== -1);
    if(!supported.length) return;
    s.loadedDeps.forEach(sub => checkSchema(sub));
  }

  return supported;
}

export const schemaTreeGetFiles = (schema:LoadedSchema) => {
  const files:string[] = [];
  const doneSchemas:string[] = [];

  const loadFilesForSchema = (s:LoadedSchema) => {
    //Prevent infinite recursion
    if(doneSchemas.indexOf(s.name) !== -1) return;
    doneSchemas.push(s.name);

    //Load files and append
    schema.loadedDeps.forEach(dep => loadFilesForSchema(dep));
    files.push(...fileGetSchemaContents(s).files);
  }

  loadFilesForSchema(schema);
  const root = PATH_COMPONENTS;

  return {
    root,
    files: files.map(file => {
      return file.split(root).join('');
    })
  };
}