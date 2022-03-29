import { GLOBAL_SELF } from "../support";

export type ShopifyXR = {
  setupXRElements:()=>any;
  setModels:(...a:any[])=>any;
  launchXR:(...a:any[])=>any;
  addModels:(...a:any[])=>any;
  getEnabledElements:()=>any;
};

export type ARListener = (xr:ShopifyXR) => any;

export type ARMedia = {
  alt:string|null;
  id:number;
  media_type:'model';
  position:number;
  preview_image:{
    aspect_ratio:number;
    height:number;
    src:string;
    width:number;
  };
  sources:{
    format:'glb'|'usdz';
    mime_type:string;
    url:string;
  }[];
}

/**
 * Listen for when AR has become available.
 * 
 * @param listener Listener to listen for whence AR is ready.
 */
export const onArReady = (listener:ARListener) => {
  if(!GLOBAL_SELF.arListeners) GLOBAL_SELF.arListeners = [];
  GLOBAL_SELF.arListeners.push(listener);
  if(GLOBAL_SELF.arLoaded) {
    listener(GLOBAL_SELF.ShopifyXR!);
  } else {
    arLoad();
  }
}

export const offArReady = (listener:ARListener) => {
  if(!GLOBAL_SELF.arListeners) return;
  const i = GLOBAL_SELF.arListeners.indexOf(listener);
  if(i === -1) return;
  GLOBAL_SELF.arListeners.splice(i, 1);
}

const arOnSetup = () => {
  let interval:NodeJS.Timeout = setInterval(() => {
    if(GLOBAL_SELF.arLoaded) {
      return clearInterval(interval);
    }
    if(!GLOBAL_SELF.ShopifyXR) return;

    GLOBAL_SELF.arLoaded = true;
    document.documentElement.classList.add('has-ar');
    if(!GLOBAL_SELF.arListeners) return;

    GLOBAL_SELF.arListeners.forEach(listener => {
      try {
        listener(GLOBAL_SELF.ShopifyXR!);
      } catch(e) {
        console.error(e);
      }
    });
  }, 32);
}

const arLoad = () => {
  if(GLOBAL_SELF.Shopify && GLOBAL_SELF.Shopify.loadFeatures) {
    if(!GLOBAL_SELF.arLoadRequested) {
      GLOBAL_SELF.arLoadRequested = true;
      GLOBAL_SELF.Shopify.loadFeatures([
        {
          name: 'shopify-xr',
          version: '1.0',
          onLoad: arOnSetup
        }
      ]);
    }
  }
}