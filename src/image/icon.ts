import { GLOBAL_SELF } from "../support";

/**
 * Returns an icon that has been predefined into the global icons store. You can
 * store an icon by defining it onto the GLOBAL_SELF.Icons object. Refer to your
 * theme's tool.icons.liquid snippet for more infro.
 * 
 * @param name Name of the icon to get.
 * @returns The SVG for the icon, or a blank SVG and a warning if not found.
 */
export const iconGet = (name:string) => {
  if(GLOBAL_SELF.Icons && GLOBAL_SELF.Icons[name]) {
    return GLOBAL_SELF.Icons[name];
  }
  console.error('Tried to get icon', name, 'but it was not defined on GLOBAL_SELF.Icons!');
  return `<svg></svg>`;
}