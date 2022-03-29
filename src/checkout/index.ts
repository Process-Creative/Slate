declare global {
  interface Window {
    OrderSummaryUpdater:any;
  }
}

export const refreshCheckout = () => {
  return new Promise<void>((resolve,reject) => {
    try {
      window['OrderSummaryUpdater'].prototype.refresh(() => {
        resolve();
      });
    } catch(e) {
      reject(e);
    }
  });
}