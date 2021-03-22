import * as $ from 'jquery';
import {
  addTask, removeTask, nextTask,
  addFinishTrigger, errorQueue
} from './queue';
import { ON_ITEM_REMOVED } from './events';

//Promise based
export const removeFromCart = (line:number) => {
  return new Promise((resolve, reject) => {
    removeFromCartCB(line, resolve, reject);
  });
}

export const removeFromCartCB = (line:number, callback?:any, errorCallback?:any) => {
  let o:any = {
    line,
    callback,
    errorCallback,
    url: '/cart/change.js',
    dataType: 'json',
    method: 'POST',
    data: {
      line,
      quantity: 0
    },
    action: 'remove'
  };

  o.success = function(data) {
    if(this.callback) this.callback(data);
    addFinishTrigger({ event: ON_ITEM_REMOVED, data});
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
};
