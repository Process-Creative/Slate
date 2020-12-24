import * as fs from 'fs';
import * as path from 'path';
import { fileGetThemeWorking } from "./file";

export const FRAMEWORKS = <const>[
  'themekit', 'slatev0', 'slatev1', 'slatev2'
];

export type Framework = ReturnType<typeof FRAMEWORKS.find>;

export const frameworkValidate = (s:string):Framework|null => {
  return FRAMEWORKS.find(fw => fw.toLowerCase() == s);
}

export const frameworkGetOldest = (frameworks:Framework[]) => {
  return FRAMEWORKS.find(fw => {
    return frameworks.some(f => fw === f)
  });
}