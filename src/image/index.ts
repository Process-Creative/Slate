import { handlize, escapeString } from './../string/';
import { getAssetUrl, getImageUrl } from './../url/';

export const SHOPIFY_VALID_IMG_SIZE_NAMES = <const>[
  'master', 'large', 'medium', 'small'
];

export type ShopifyImageSizes = ReturnType<typeof SHOPIFY_VALID_IMG_SIZE_NAMES.find>;
export type ShopifyImageSize = ShopifyImageSizes | string | number;


type ImageSize = {
  ratios?:number[], size:ShopifyImageSize, screen?:string|number
};
type LazyImageParams = {
  dataSrc?:boolean;
  dataExpand?:number;
  dataSizes?:boolean;
  class?:boolean;
  className?:string;
}

export type AccentuateImage = {​
  alt:string
  aspect_ratio:number
  cloudinary_src:string
  filename:string
  handle:string
  height:number
  id:number
  key:string
  media_type:string
  mime_type:string
  original_src:string
  scope:string
  src:string
  width:number
};

export type ImageSource = AccentuateImage | string;
type GenPictureParams = {
  src:ImageSource;
  srcSize:ShopifyImageSize;
  sizes?:ImageSize[];
  class?:string;
  alt?:string;
  attributes?:string;
  lazy?:LazyImageParams;
  cache?:boolean;
  cloudinarySrc?:string;
};

export const pictureGenerate = (params:GenPictureParams) => {
  const ratios = [ 1, 2 ]; //x4 ratio not used for now due to device inconsistency
  let buffer = `<picture>`;

  //@deprecated
  if(typeof params['cloudinarySrc'] !== typeof undefined) {
    params.src = params['cloudinarySrc']!;
  }

  //Random version number, used to disable cache
  const versionNumber = params.cache == false ? Math.floor(Math.random() * 1000000000) : '';

  //Append the largest size twice so that it can become the last "max width"
  const sizes = [ ...(params.sizes||[]) ]
  if(sizes.length > 1) {
    const largestSize = sizes[sizes.length - 1];
    sizes.push(largestSize);

    //Generate media sources
    sizes.forEach((size,si) => {
      const isLast = si === params.sizes!.length - 1;

      buffer += '<source media="';
      if(typeof size.screen === 'string') {
        buffer += size.screen;
      } else {
        let w = size.screen || (typeof size.size === 'number' ? size.size : null);
        if(!w) return;
        buffer += `(${isLast?'min':'max'}-width:${w}px)`;
      }
      buffer += `" ${params.lazy&&params.lazy.dataSrc?'data-src':'src'}="`;

      //Generate src for each image ratio
      ratios.forEach((r,y) => {
        let imageSize = size.size;
        if(typeof size.size === 'number') imageSize = size.size * r;
        buffer += getImageUrl(params.src, imageSize);
        buffer += `${versionNumber? `?v=${versionNumber}` : ``}"`;
        if(r != 1) buffer += ` ${r}x`;
        if(y < (ratios.length-1)) buffer += ', ';
      });

      if(params.alt) buffer += `alt="${params.alt}" `;
      if(params.lazy && params.lazy.dataSizes) buffer += `data-sizes="auto" `;
      buffer += '/>';
    });
  }

  //Add the base image
  const attributes:{[key:string]:string} = {};
  attributes[
    params.lazy && params.lazy.dataSrc ? 'data-src' : 'src'
  ] = `${getImageUrl(params.src, params.srcSize)}${versionNumber? `?v=${versionNumber}` : ``}`;
  attributes['class'] = [
    params.class,
    params.lazy && params.lazy.class ? (
      params.lazy.className || 'lazyload' 
    ): null
  ].filter(f => f).join(' ')
  if(params.alt) attributes['alt'] = escapeString(params.alt);

  if(params.lazy) {
    if(params.lazy.dataExpand) {
      attributes['data-expand']= params.lazy.dataExpand+'';
    }
  }
  
  buffer += `<img ${Object.keys(attributes).reduce((x,key) => {
    return `${x} ${key}="${attributes[key]}"`;
  }, '')} ${params.attributes||''} />`;
  
  buffer += `</picture>`;
  return buffer;
}

export const pictureGenerateElement = (params:GenPictureParams) => {
  let div = document.createElement('div');
  div.innerHTML = pictureGenerate(params);
  return div.querySelector('picture');
}