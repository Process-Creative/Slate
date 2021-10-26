import { cartChange, cartGetCurrent, cartUpdate } from "cart"

export const cartRemove = (line:number) => cartChange({ line, quantity: 0 });

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