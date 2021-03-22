import * as $ from 'jquery';

import { jsonFromjQuery } from './../jquery/';
import { ON_CART_FETCHED } from './events';
import {
  addTask, removeTask, nextTask,
  addFinishTrigger, errorQueue
} from './queue';

//Internal method only, do not use unless you know what you're doing!!
export const setCurrentCart = (cart:any) => {
  window[`Cart`].data = cart;
  return cart;
}

/*** Current Cart ***/
export const getCurrentCart = () => {

  //Using JavaScript
  if(window[`Cart`] && window[`Cart`].data) return window [`Cart`].data;

  //Using JSON+jQuery
  let cartElement = $('[data-cart-json]');
  if(cartElement.length) return window[`Cart`].data = jsonFromjQuery(cartElement);

  //using Ajax...
  console.warn('No default cart was loaded, app will get cart via ajax and be blocking!! Dump the cart json into window.Cart before requesting it.');
  getCartCB(null, null, { async: false });

  return getCurrentCart();
};

//Promise Flavour
export const getCart = () => {
  return new Promise((resolve,reject) => getCartCB(resolve, reject));
};

//Callback Flavour
export const getCartCB = (callback?:any, errorCallback?:any, params?:object) => {
  let o:any = {
    callback, errorCallback,
    url: '/cart.js',
    method: 'GET',
    dataType: 'json',
    data: {},
    action: 'get'
  };

  if(params) o = {...o, params};

  o.success = function(data:any) {
    setCurrentCart(data);
    if(this.callback) this.callback(data);
    addFinishTrigger({ event: ON_CART_FETCHED, data });
    removeTask(this);
    nextTask();
  }.bind(o);

  o.error = function(e,i) {
    if(typeof this.errorCallback === "function") {
      this.errorCallback(e ? e.responseJSON || e : 'Unknown Error');
    }
    removeTask(this);
    errorQueue();
  }.bind(o);

  o.task = function() {
    $.ajax(this);
  }.bind(o);

  addTask(o);
};
