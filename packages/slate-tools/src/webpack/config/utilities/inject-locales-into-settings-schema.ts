import * as fs from 'fs-extra';
import * as path from 'path';
const {
  createSchemaContentWithLocales, combineLocales,
} = require('@process-creative/slate-translations');

export const injectLocalesIntoSettingsSchema = async (content:any, filePath:any) => {
  if (path.basename(filePath) !== 'settings_schema.json') {
    return content;
  }

  const localesFolder = path.resolve(path.dirname(filePath), 'locales');
  const combinedLocales = (await fs.exists(localesFolder))
    ? await combineLocales(localesFolder)
    : null
  ;

  return combinedLocales
    ? createSchemaContentWithLocales(combinedLocales, filePath)
    : content
  ;
};
