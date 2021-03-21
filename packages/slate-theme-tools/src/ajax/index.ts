import * as $ from 'jquery';

export const ajaxRequest = <P,R=any>(url:string, method:string, data?:P, params?:any):Promise<R> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url, method, data: (data||{}), ...(params||{}),
      success: (data:R) => {
        resolve(data);
      },
      error: (xhr,status,error) => reject(error),
    });
  });
}

export const shopifyGet = async <P,R=any>(url:string, data?:P):Promise<R> => {
  let x = await ajaxRequest<P,string>(url, 'GET', data) as any;
  try {
    x = JSON.parse(x);
  } catch(e) {
    console.warn(e);
  }
  return x as R;
};

export const shopifyPost = async <P,R=any>(url:string, data?:P) => {
  return ajaxRequest<P,R>(url, 'POST', data, { dataType: 'html' });
};