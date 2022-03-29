import { ShopifyImageSize, ImageSource, SHOPIFY_VALID_IMG_SIZE_NAMES, AccentuateImage } from "../image";
import { GLOBAL_SELF } from "../support";

const CDN_URL = '//cdn.shopify.com';

export const getAssetUrl = (asset:string):string => {
  if(!GLOBAL_SELF['Asset']) throw new Error("You have not setup a same asset url for the script to use! Ensure window.Asset has been set with any asset url!");

  let a = GLOBAL_SELF['Asset'];
  let y = a.split('/');
  let x = y[y.length-1];

  if(x.includes('?v=')) {
    let z = x.split('?');
    const strZ = z[z.length-1];
    y.splice(-1, 1);
    y.push(asset);
    return `${y.join('/')}?${strZ}`;
  } else {
    y.splice(-1, 1);
    y.push(asset);
    return y.join('/');
  }
};

export const getCdnUrl = ():string => {
  let y = getAssetUrl('').split('/');
  y.splice(y.length-4, y.length);
  return y.join('/');
};

export const getImageUrl = (src:ImageSource|null, size:ShopifyImageSize|null):string|null => {
  if(!src) {
    //Source not specified / valid, return the no-image image.
    return `${CDN_URL}/s/assets/no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c.gif`;
  }

  //Resize Cloudinary
  let srcFirst = Array.isArray(src) ? src[0] : src;
  let isCloudinary = typeof srcFirst.cloudinary_src !== typeof undefined;
  if(isCloudinary) {
    let img = srcFirst as AccentuateImage;
    if(!size) return img.original_src;
    return img.cloudinary_src + 'w_' + size;
  }

  let strSrc:string = (
    !src ? '' :
    typeof src === 'string' ? src :
    src.src
  );

  let removeProtocol = (path:string) => {
    let str = path.replace(/http(s)?:/, '');
    if(!str.startsWith(CDN_URL)) str = `${CDN_URL}${str}`;
    if(str.indexOf('?') !== -1 ) {
      let bits = str.split('?');
      bits.pop();
      str = bits.join('?');
    }
    return str;
  };

  let strSize = size ? `${size}` : null;//Convert to string
  if(!strSize) return removeProtocol(strSrc);

  if(SHOPIFY_VALID_IMG_SIZE_NAMES.some(vimg => strSize == vimg)) {

  } else {
    if(!strSize.endsWith('x')) strSize += 'x';
  }

  if(strSrc.indexOf('.') !== -1) {
    let bits = removeProtocol(strSrc).split('.');
    let ext = bits.pop();//Remove extension
    let possiblyHasSize = bits.pop();//Get the last . element


    if(possiblyHasSize && possiblyHasSize.length) {
      let pathSplit = possiblyHasSize.split('/');//Remove paths
      let splitByUnderscore = pathSplit.pop()!.split('_');
      let end = splitByUnderscore.pop()!;//this is possibly a valid size string


      //Remove string
      if((
        SHOPIFY_VALID_IMG_SIZE_NAMES.some(s => end === s) ||
        end.endsWith('x') && end.replace(/\d/g, '').length === 1
      )) {
        strSrc = [
          bits.join('.'),
          bits.length ? '.' : '',
          pathSplit.join('/'),
          pathSplit.length ? '/' : '',
          splitByUnderscore.filter(f => f && f.length).join('_'),
          `.${ext}`
        ].join('');
      }
    }
  }

  let match = strSrc.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
  if (!match) return null;


  let prefix = strSrc.split(match[0]);
  let suffix = match[0];
  return removeProtocol([
    [
      prefix[0].trim(),
      size === 'master' ? null : strSize.trim(),
    ].filter(f => f).join('_'),
    suffix
  ].filter(f => f && f.length).join(''));
};
