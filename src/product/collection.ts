import { WithCollection } from "..";

export const collectionGetUrl = (p:WithCollection) => {
  return collectionGetUrlFromHandle(p.collection);
}

export const collectionGetUrlFromHandle = (p:{ handle:string }) => {
  return `/collections/${p.handle}`;
}