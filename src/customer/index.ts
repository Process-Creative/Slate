import { Customer } from "../types/customer";

export const customerGet = ():Customer|null => {
  if(!window || typeof window.Customer === typeof undefined) {
    throw new Error('Customer is undefined... probably because you haven\'t set window.Customer to a JSON formatted Customer object!');
  }
  return window.Customer;
}