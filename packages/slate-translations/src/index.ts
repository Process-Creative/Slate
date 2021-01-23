import { promises as fs } from 'fs';
import * as path from 'path';
import * as  _ from 'lodash';


/**
 * Goes through the main schema to get the translation keys and to fill the schema with translations
 *
 * @param {*} localizedSchema The schema with the combined locales
 * @param {*} mainSchemaPath The path to the main schema (schema.json)
 * @returns
 */
export const createSchemaContentWithLocales = async (localizedSchema:object, mainSchemaPath:string) => {
  const traverse = async (obj:object) => {
    await Promise.all(Object.keys(obj).map(async key => {
      if (typeof obj[key].t === 'string') {
        obj[key] = await _getLocalizedValues(obj[key].t, localizedSchema);
      } else if (typeof obj[key] === 'object') {
        await traverse(obj[key]);
      }
    }));
    return JSON.stringify(obj, null, 2);
  };

  const mainSchemaRaw = await fs.readFile(mainSchemaPath, 'utf-8');
  const mainSchema = JSON.parse(mainSchemaRaw)
  return traverse(mainSchema);
}

/**
 * Creates a single JSON object from all the languages in locales
 *
 * @param {*} localesPath Absolute path to the locales folder /sections/section-name/locales/
 * @returns
 */
export const combineLocales = async (localesPath:string) => {
  const localesFiles = await fs.readdir(localesPath);
  const jsonFiles = localesFiles.filter((fileName) =>
    fileName.endsWith('.json'),
  );

  return jsonFiles.reduce(async (promise, file) => {
    const accumulator = await promise;
    const localeCode = path
      .basename(file)
      .split('.')
      .shift();
    const fileContents = JSON.parse(
      await fs.readFile(path.resolve(localesPath, file), 'utf-8'),
    );
    accumulator[localeCode] = fileContents;
    return accumulator;
  }, Promise.resolve({}));
}

/**
 * Gets all the translations for a translation key
 *
 * @param {*} key The key of the value to receive within the locales json object
 * @param {*} localizedSchema Object containing all the translations in locales
 * @returns Object with index for every language in the locales folder
 */
async function _getLocalizedValues(key:string, localizedSchema:object) {
  const combinedTranslationsObject = {};

  await Promise.all(Object.keys(localizedSchema).map(lang => {
    combinedTranslationsObject[lang] = _.get(localizedSchema[lang], key);
  }));

  return combinedTranslationsObject;
}