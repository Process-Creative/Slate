import * as $ from 'jquery';
import { ON_CART_FINISHED, ON_CART_PENDING } from './events';

import { getCartCB } from './get';

//Constants
export const CART_QUEUE:any[] = [];
export const FINISH_TRIGGERS:FinishTrigger[] = [];

//Interfaces
export interface FinishTrigger { event:string, data:any };

//Task Management
export const getCartState = ():'pending'|'finished' => {
  return CART_QUEUE.length ? 'pending' : 'finished';
}

/** @deprecated */
export const addTask = (task) => {
  CART_QUEUE.push(task);
  if(CART_QUEUE.length === 1) {
    //First task
    $(document).trigger(ON_CART_PENDING);
    nextTask();
  }
};

/** @deprecated */
export const removeTask = (task) => {
  let { action } = task;
  let i = CART_QUEUE.indexOf(task);

  //This will be called every time a task finished OR fails, if the final task
  //is not a GET cart, then we're going to do a get cart
  let isLast = CART_QUEUE.length === 1;
  if(isLast && !(
    action == 'get' || action == 'details' || action == 'clear'
  )) getCartCB();//This will add a get cart task

  if(i !== -1) return CART_QUEUE.splice(i, 1);
  nextTask();
}

/** @deprecated */
export const errorQueue = () => {
  let queue = [...CART_QUEUE];

  CART_QUEUE.splice(0, CART_QUEUE.length);

  queue.forEach(e => {
    if(!e.errorCallback) return;
    e.errorCallback("Another task failed");
    removeTask(e);
  });

  $(document).trigger(ON_CART_FINISHED);
};

//Trigger Management
/** @deprecated */
export const addFinishTrigger = (trigger:FinishTrigger) => {
  if(FINISH_TRIGGERS.indexOf(trigger) !== -1) return;
  FINISH_TRIGGERS.push(trigger);
};

/** @deprecated */
export const removeFinishTrigger = (trigger:FinishTrigger) => {
  let i = FINISH_TRIGGERS.indexOf(trigger);
  if(i === -1) return;
  FINISH_TRIGGERS.splice(i,1);
};

//Queue Management
/** @deprecated */
export const nextTask = () => {
  //Is the task list finished?
  if(!CART_QUEUE.length) {
    [...FINISH_TRIGGERS].forEach(trigger => {
      $(document).trigger(trigger.event, trigger.data);
      removeFinishTrigger(trigger);
    });
    $(document).trigger(ON_CART_FINISHED);
    return;
  }

  //Fetch the next task
  let task = CART_QUEUE[0];
  task.task();
}
