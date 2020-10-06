import { SlateTheme, getThemePreviewUrl } from './../src/utils/ThemeUtils';

export const getTheme = () => Cypress.env('theme') as SlateTheme;

export const getThemeUrl = (path:string) => {
  return getThemePreviewUrl({ theme: getTheme(), path });
}


type WithUrlCallback = (url:string) => void;
type WithUrlParams = { url:string, where?:string, callback:WithUrlCallback };
export const withUrlMatch = (params:WithUrlParams) => {
  cy.visit(getThemeUrl(params.where || '/'));
  const selector = `[href*="${params.url}"]`;

  return cy.get(selector)
    .should('exist')
    .then(el => {
      let href = el.attr('href');
      params.callback(href);
    })
  ;
}

export const withUrlMatchVisit = (params:WithUrlParams) => {
  return withUrlMatch({ ...params,
    callback: url => {
      cy.visit(window.location.origin + url).then(() => params.callback(url))
    }
  })
};

export const withProductPage = (callback:WithUrlCallback) => {
  return withUrlMatchVisit({ url: '/products/', callback });
};

type ICartAdd = { id:number|string, quantity:number, properties?:{[key:string]:string} }
type CartAddParams = { items:ICartAdd[]  };
export const addToCart = (params:CartAddParams) => {
  cy.log(`bruh ${JSON.stringify(params)}`);
  return cy.request({
    method: 'POST',
    url: getThemeUrl('/cart/add.js'),
    body: params,
    headers: { 'content-type': 'application/json' },
  });
}

export const clearCart = () => {
  return cy.request({ url: getThemeUrl('/cart/clear.js'), qs: { } });
};