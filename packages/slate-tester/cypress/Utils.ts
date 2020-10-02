import { SlateTheme, getThemePreviewUrl } from './../src/utils/ThemeUtils';

export const getTheme = () => Cypress.env('theme') as SlateTheme;

export const getThemeUrl = (path:string) => {
  return getThemePreviewUrl({ theme: getTheme(), path });
}