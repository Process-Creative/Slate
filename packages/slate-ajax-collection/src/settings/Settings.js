/*
  Here's my "Really quick" How the URLs work for both parsing and unparsing
  Example Query:
    ?size=20,30,50&color=Red&group=(range%253D0-100%2526vendor%253DApple)

  Bloated:
    {
      size: [ 20, 30, 50 ],
      color: [ "Red" ],
      group: {
        range: {min:0, max:100},
        vendor: "Apple"
      }
    }

  Just an example.
*/

import { TagFilter, OPERATION_AND } from './../filter/';
import { handlize } from '@process-creative/slate-theme-tools';

export class Settings {
  constructor(template) {
    this.template = template;

    //This will be populated later by a mixture of filters, sort and pagination.
    //Don't manually update this object, it won't trigger a url rewrite, facet change etc.
    this.settings = {};
    this.hasLoaded = true;
  }

  //Encodes an object into a format that can be used in a url, also recursive.
  urlEscapeObject(object) {
    object = object || {};

    //Get our objects keys
    let keys = Object.keys(object);

    //Create an array containing a list of encoded strings
    let bufferArray = [];

    keys.forEach(key => {
      let value = object[key];

      //If undefined just ignore.
      if(typeof value === typeof undefined) return;
      if(value == null) return;

      //Change the format depending on the type
      if(Array.isArray(value)) {
        if(!value.length) return;
        value = value.filter(b => b).map(b => encodeURIComponent(b)).join(',');//Comma seperate Arrays

      } else if(typeof value === "object") {
        var subBuffer = this.urlEscapeObject(value);//Objects become wrapped subobjects
        if(!subBuffer.length) return;
        value = `(${subBuffer})`;//Wrapping occurs

      } else {
        value = `${value}`;//Convert to string...
        if(!value.length) return;//Empty string.
      }

      //Append to array!
      bufferArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });

    //Join with ampersands (They'll be escaped if sub objecting)
    return bufferArray.join('&');
  }

  //Decodes an object from a query string
  urlUnescapeObject(string) {
    let o = {};
    let parts = (string||'').split('&');

    parts.forEach(part => {
      let bits = part.split('=');
      let key = bits.shift();
      let value = bits.join('=');
      if(!key || !value) return;

      if(value.startsWith("(")) {
        value = value.substring(1, value.length-1);//Remove brackets
        value = this.urlUnescapeObject(decodeURIComponent(value));//Unescape
      } else {
        value = decodeURIComponent(value);

        let decodeCrap = crap => {
          crap = crap.split(",").map(v => decodeURIComponent(v));
          if(!crap.length) return;
          if(crap.length === 1) {
            crap = crap[0];
            let fv = parseFloat(crap);
            if(!isNaN(fv) && isFinite(fv) && crap.replace(/\D/g, '').length === crap.length) return [ fv ];
            if(crap === "true") return [ true ];
            if(crap === "false") return [ false ]; 
            return [ crap ];
          } else {
            crap = crap.map(v => {
              let nv = decodeCrap(v);
              return nv.length === 1 ? nv[0] : nv;
            });
          }
          return crap;
        }

        value = decodeCrap(value);
        if(value.length === 1) value = value[0];
      }

      o[key] = value;
    });

    return o;
  }

  //Takes the current setting (as well as any override object you pass) and
  //returns a url string that can later be decoded and used.
  getSettingsUrl(overrides) {
    //Check overrides, custom overrides for the internal settings.
    if(!overrides) overrides = {};

    //Returns the url for the page, based on current filter settings.
    let x = this.template.getUrl();

    //Fallback Tag support, tag only the first tag from each filter and put them
    //into a nice + array, not exactly the same but close enough for native support
    let tags = [];
    this.template.filters.filters.forEach(f => {
      if(!(f instanceof TagFilter)) return;
      if(!f.tags.length) return;
      if(f.handle != 'tags') return;

      //Check the operation type, if it's AND we may be able to do it the old
      //fashioned way.
      if(f.operation == OPERATION_AND) {
        //Awesome, this is an AND Filter, we can be more specific
        tags.push(...f.tags);
        return;
      }

      tags.push(f.tags[0]);//Only going to use the first tag.
    });

    //Now remove duplicates
    tags = tags.filter((t,i) => tags.indexOf(t) === i);
    if(tags.length) x += `/${tags.join('+').toLowerCase()}`;//Shopify convers the tags to lowercase

    //Query String Parameters
    let params = {
      ...this.settings,
      ...overrides
    }

    //Sanitize the url, here we can remove some query settings if we need
    if(params.page && parseInt(params.page) <= 1) delete params.page;
    if(params.sort_by && params.sort_by == this.template.sort.getDefaultSortMethod()) delete params.sort_by;
    delete params.tags;

    if(this.template.modifyUrlParams) params = this.template.modifyUrlParams(params);

    //Escape
    let query = this.urlEscapeObject(params);
    if(query.length) x += '?'+query;//Append to url

    return x;
  }

  getSettingsFromUrl(urlString) {
    let url = new URL(urlString);

    //Functional Opposite of above.
    let [ emptyString, qs ] = url.search.split('?');
    let settings = {};
    if(qs && qs.length) settings = {...settings, ...this.urlUnescapeObject(qs)};

    //Tag the tags from the url
    let [ empty, collection, myHandle, tags ] = url.pathname.split('/');
    if(tags && tags.length) {
      settings.tags = tags.split('+').map(t => {
        //Find the real tag, since this tag is a handle representation
        if(!t.length) return null;
        let realTag = this.template.data.allTags.find(real => {
          return handlize(real) === t;
        });
        return realTag;
      }).filter(t => t);
    }

    return settings;
  }

  setSetting(key, value) {
    if(!this.hasLoaded) return;

    //Update the value, null values are removed
    this.settings[key] = value;
    this.updateHistory();
  }

  setSettings(settings) {
    if(!this.hasLoaded) return;

    //Bulk update settings
    this.settings = {...this.settings, ...settings};
    this.updateHistory();
  }

  updateHistory() {
    //Update the history
    let h = history || window.history;
    if(!h) return;
    h.replaceState(this.settings, "", this.getSettingsUrl());
  }

  load() {
    this.hasLoaded = true;
    //Attempt to load from the url
    this.settings = this.getSettingsFromUrl(window.location.toString());
  }
}
