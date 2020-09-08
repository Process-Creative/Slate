import { SlateTheme, getThemePreviewUrl } from './../src/utils/ThemeUtils';

export const getThemeUrl = (path:string) => {
  const theme:SlateTheme = Cypress.env("theme") as SlateTheme;
  return getThemePreviewUrl({ theme, path });
}