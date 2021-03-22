import { shopifyPost, shopifyGet } from './../ajax/';

let customer;

export const fetchCustomer = async () => {
  return customer = await shopifyGet('/', { view: 'customer-json' });
}

export const getCustomer = () => {
  if(customer) return customer;
  if(typeof window['Customer'] !== typeof undefined) return customer = window['Customer'];
  fetchCustomer();
  throw new Error('Customer is undefined... probably because you haven\'t set window.Customer to a JSON formatted Customer object!');
}

export const createCustomer = async (customer:object,extra:object={}) => {
  let result = await shopifyPost('/account', {
    utf8: "✓", form_type: "create_customer", customer, ...extra
  });
  return await fetchCustomer();
}
 
