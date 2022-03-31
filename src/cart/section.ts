import { queryEncodeString } from "../string";

export const CART_BUNDLED_SECTIONS:string[] = [];

export const cartBundledSectionAdd = (section:string) => {
  if(CART_BUNDLED_SECTIONS.indexOf(section) !== -1) return;
  CART_BUNDLED_SECTIONS.push(section);
}

export const cartBundledSectionRemove = (section:string) => {
  const id = CART_BUNDLED_SECTIONS.indexOf(section);
  if(id === -1) return;
  CART_BUNDLED_SECTIONS.splice(id, 1);
}

export const cartBundledSectionGetQueryParams = (url:string) => {
  return `${url}?${queryEncodeString({ sections: CART_BUNDLED_SECTIONS })}`;
}