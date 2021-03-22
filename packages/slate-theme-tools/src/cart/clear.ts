import * as $ from 'jquery';
import {
  addTask, removeTask, nextTask,
  addFinishTrigger, errorQueue
} from './queue';
import { setCurrentCart } from './get';
import { ON_CART_CLEARED, ON_CART_FETCHED } from './events';

export const clearCart = () => {
  return new Promise((resolve, reject) => clearCartCB(resolve,reject));
};

export const clearCartCB = (callback?:any, errorCallback?:any) => {
  let o:any = {
    callback, errorCallback,
    url: '/cart/clear.js',
    dataType: 'json',
    method: 'GET',
    data: {},
    action: 'clear'
  };

  o.success = function(data) {
    setCurrentCart(data);//The returned value is the full cart, we can use it to update the cart
    if(this.callback) this.callback(data);
    addFinishTrigger({ event: ON_CART_CLEARED, data });
    addFinishTrigger({ event: ON_CART_FETCHED, data });
    removeTask(this);
    nextTask();
  }.bind(o);

  o.error = function(e, i, a) {
    if(this.errorCallback) this.errorCallback(e ? e.responseJSON || e : "Unknown Error");
    removeTask(this);
    errorQueue();
  }.bind(o);

  o.task = function() {
    $.ajax(this);
  }.bind(o);

  addTask(o);
};
