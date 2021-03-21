import * as $ from 'jquery';
import {
  addTask, removeTask, nextTask,
  addFinishTrigger, errorQueue
} from './queue';
import { ON_ITEM_UPDATED } from './events';

//Promise Flavour
export const updateCart = (lineIndex:number, quantity:number=1) => {
  return new Promise((resolve,reject) => {
    updateCartCB(lineIndex, quantity, resolve, reject);
  });
}

//Callback flavour
export const updateCartCB = (line:number, quantity:number=1, callback?:any, errorCallback?:any) => {
  let o:any = {
    line,
    quantity,
    callback,
    errorCallback,
    url :'/cart/change.js',
    dataType: "json",
    method: 'POST',
    data: {
      line,
      quantity
    },
    action: 'update'
  };

  o.success = function(data) {
    if(this.callback) this.callback(data);
    addFinishTrigger({ event: ON_ITEM_UPDATED, data});
    removeTask(this);
    nextTask();
  }.bind(o);

  o.error = function(e,i,a) {
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
}
