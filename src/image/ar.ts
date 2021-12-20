
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
  if(!window.arListeners) window.arListeners = [];
  window.arListeners.push(listener);
  if(window.arLoaded) {
    listener(window.ShopifyXR!);
  } else {
    arLoad();
  }
}

export const offArReady = (listener:ARListener) => {
  if(!window.arListeners) return;
  const i = window.arListeners.indexOf(listener);
  if(i === -1) return;
  window.arListeners.splice(i, 1);
}

const arOnSetup = () => {
  let interval:NodeJS.Timeout = setInterval(() => {
    if(window.arLoaded) {
      return clearInterval(interval);
    }
    if(!window.ShopifyXR) return;

    window.arLoaded = true;
    document.documentElement.classList.add('has-ar');
    if(!window.arListeners) return;

    window.arListeners.forEach(listener => {
      try {
        listener(window.ShopifyXR!);
      } catch(e) {
        console.error(e);
      }
    });
  }, 32);
}

const arLoad = () => {
  if(window && window.Shopify && window.Shopify.loadFeatures) {
    if(!window.arLoadRequested) {
      window.arLoadRequested = true;
      window.Shopify.loadFeatures([
        {
          name: 'shopify-xr',
          version: '1.0',
          onLoad: arOnSetup
        }
      ]);
    }
  }
}