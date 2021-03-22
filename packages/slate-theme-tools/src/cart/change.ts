import * as $ from 'jquery';
import {
  addTask, removeTask, nextTask,
  addFinishTrigger, errorQueue
} from './queue';
import { ON_ITEM_CHANGED } from './events';

type CartChangeByVariant = { variant: string, quantity:number };
type CartChangeByKey = { key:string, quantity:number };
export type CartChange = CartChangeByVariant|CartChangeByKey

//Promise
export const changeCart = (changes:CartChange|CartChange[]) => {
  return new Promise((resolve, reject) => {
    changeCartCb(changes, resolve, reject);
  });
};

export const changeCartCb = (changes:CartChange|CartChange[], callback?:any, errorCallback?:any) => {
  if(!Array.isArray(changes)) changes = [ changes ];

  let updates = changes.reduce((x:any,c):any => {
    let v = (c as CartChangeByVariant).variant || (c as CartChangeByKey).key;
    let q = c.quantity;
    x[v] = q;
    return x;
  }, {});

  let o:any = {
    updates,
    callback,
    errorCallback,
    url :'/cart/update.js',
    dataType: "json",
    method: 'POST',
    data: { updates },
    action: 'change'
  };

  o.success = function(data) {
    if(this.callback) this.callback(data);
    addFinishTrigger({ event: ON_ITEM_CHANGED, data});
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
