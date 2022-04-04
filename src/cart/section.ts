import { queryEncodeString } from "../string";

export const cartBundledSectionsGet = ():string[] => {
  //@ts-ignore
  return window.CART_BUNDLED_SECTIONS || [];
}

export const cartBundledSectionsSet = (sections:string[]) => {
  //@ts-ignore
  window.CART_BUNDLED_SECTIONS = sections;
}

export const cartBundledSectionAdd = (section:string) => {
  const bundles = cartBundledSectionsGet();
  if(bundles.indexOf(section) !== -1) return;
  bundles.push(section);
  cartBundledSectionsSet(bundles);
}

export const cartBundledSectionRemove = (section:string) => {
  const bundles = cartBundledSectionsGet();
  const id = bundles.indexOf(section);
  if(id === -1) return;
  bundles.splice(id, 1);
  cartBundledSectionsSet(bundles);
}

export const cartBundledSectionGetQueryParams = (url:string) => {
  return `${url}?${queryEncodeString({ sections: cartBundledSectionsGet() })}`;
}