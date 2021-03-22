import * as $ from 'jquery';
import {
  addTask, removeTask, nextTask,
  addFinishTrigger, errorQueue
} from './queue';
import { getCurrentCart, setCurrentCart } from './get';
import { ON_DETAILS_SET, ON_CART_FETCHED } from './events';

export const setCartNote = (note:string) => setCartDetails(undefined, note);
export const addCartAttributes = (attributes:object[]) => setCartDetails(attributes);

export const setCartAttributes = (attributes:object[]) => {
  let cart = getCurrentCart();
  cart.attributes = cart.attributes || {};
  Object.keys(cart.attributes).forEach(key => attributes[key] = '');
  return setCartDetails(attributes);
}

export const setCartDetails = (attributes?:any[], note?:string) => {
  return new Promise((resolve, reject) => setCartDetailsCB(attributes, note, resolve, reject));
};

export const setCartDetailsCB = (attributes?:any[], note?:string, callback?:any, errorCallback?:any) => {
  //A null note will be undefined (so it won't update), use "" instead for empty.
  if(note == null) note = undefined;

  let o:any = {
    callback, errorCallback,
    url: `/cart.js`,
    method: 'POST',
    dataType: 'json',
    data: { note, attributes },
    action: 'details'
  };

  o.success = function(data) {
    setCurrentCart(data);//The returned value is the full cart, we can use it to update the cart
    if(this.callback) this.callback(data);
    addFinishTrigger({ event: ON_DETAILS_SET, data });
    addFinishTrigger({ event: ON_CART_FETCHED, data });
    removeTask(this);
    nextTask();
  }.bind(o);

  o.error = function(e,i,a) {
    if(this.errorCallback) this.errorCallback(e ? e.responseJSON || e : 'Unknown Error');
    removeTask(this);
    errorQueue();
  }.bind(o);

  o.task = function() {
    $.ajax(this);
  }.bind(o);

  addTask(o);
};
