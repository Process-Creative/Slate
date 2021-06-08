type Eventable = HTMLElement;

type EventMap = keyof HTMLElementEventMap;

export type EventAddParams<K extends EventMap> = {
  element:HTMLElement,
  event:K
  callback:(this:HTMLElement,ev:HTMLElementEventMap[K])=>any;
};

/**
 * Attaches an event listener to an element. Returns the remove event listener
 * for you. Allows use of anonymous arrow functions.
 * @param p Information about the event to add.
 * @returns The event remover function.
 */
export const eventAdd = <K extends EventMap>(p:EventAddParams<K>) => {
  const { event, callback } = p;
  console.log(event);
  p.element.addEventListener(event, callback);
  return () => p.element.removeEventListener(event, callback);
}