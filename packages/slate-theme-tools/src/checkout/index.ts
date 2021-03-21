export const refreshCheckout = () => {
  return new Promise((resolve,reject) => {
    try {
      window['OrderSummaryUpdater'].prototype.refresh(() => {
        resolve();
      });
    } catch(e) {
      reject(e);
    }
  });
}