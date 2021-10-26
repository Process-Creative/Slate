import { Customer } from "types";

declare global {
  interface Window {
    Customer:Customer|null;
  }
}

export const customerGet = () => {
  if(!window || !window.Customer) {
    throw new Error('Customer is undefined... probably because you haven\'t set window.Customer to a JSON formatted Customer object!');
  }
  return window.Customer;
}