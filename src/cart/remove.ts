import { cartChange, cartGetCurrent, cartUpdate } from "./";

export const cartRemove = (line:number|string) => cartChange({ id: line, quantity: 0 });

export const cartRemoveLines = (lines:number[]) => cartUpdate({
  updates: cartGetCurrent().items.reduce((x,y,i) => {
    const shouldRemove = lines.some(l => l === i);
    if(shouldRemove) {
      x.push(0);
    } else {
      x.push(y.quantity);
    }
    return x;
  }, [] as number[])
});