export const jsonFromjQuery = (jQueryElement:JQuery<HTMLElement>) => {
  //Validate element
  if(!jQueryElement || !jQueryElement.length) throw new Error(`Invalid jQuery Element for parsing`);

  //Get HTML contents
  let contents = jQueryElement.html();

  //Attempt to parse
  return JSON.parse(contents);
};

export const jqueryGet = ():JQueryStatic|null => {
  return (
    window['$'] || window['jQuery'] || window['jquery'] ||
    window['Checkout']['jQuery'] || window['Checkout']['$']
  );
}

export const jq = jqueryGet();