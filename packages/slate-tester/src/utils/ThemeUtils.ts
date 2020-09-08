import { SlateEnv } from "@process-creative/slate-env";

export type SlateTheme = {
  shopName:string;
  themeId?:string;
};

export interface getThemePreviewUrlParams {
  theme:SlateTheme;
  path?:string;
}

export const getThemePreviewUrl = ({ theme, path }:getThemePreviewUrlParams) => {
  let shopName:string, themeId:string;

  theme = theme || (Cypress.config() as any as SlateTheme);
  shopName = theme ? theme.shopName : null;
  themeId = theme ? theme.themeId : null;

  if(!shopName) throw new Error(`Missing Shop ID in either configuration, args or cypress`);

  return `https://` +
    (shopName) +
    (shopName.endsWith(".myshopify.com") ? "" : ".myshopify.com") +
    (path||'') + 
    (themeId?`?preview_theme_id=${themeId}`:'')
  ;
}