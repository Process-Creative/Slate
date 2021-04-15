import { SlateEnv } from "./env";

export const getThemePreviewUrl = (env:SlateEnv, path:string='') => {
  return `https://${env.SLATE_STORE}${path}?preview_theme_id=${env.SLATE_THEME_ID}`;
}