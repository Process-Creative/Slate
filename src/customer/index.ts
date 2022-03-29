import { GLOBAL_SELF } from "../support";
import { Customer } from "../types/customer";

export const customerGet = ():Customer|null => {
  if(!GLOBAL_SELF || typeof GLOBAL_SELF.Customer === typeof undefined) {
    throw new Error('Customer is undefined... probably because you haven\'t set window.Customer to a JSON formatted Customer object!');
  }
  return GLOBAL_SELF.Customer;
}