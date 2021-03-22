import { TagFacet } from './TagFacet';

export const getTagsWithPrefixes = (prefixes, tags, token) => {
  tags = tags.filter(t => {
    let split = t.split(token);
    if(split.length < 2) return;
    let [ prefix ] = split;
    return prefixes.some(p => p.toLowerCase() == prefix.toLowerCase());
  });

  tags = tags.filter((t,i) => {
    return i === tags.findIndex(t2 => t2.toLowerCase() === t.toLowerCase());
  });

  tags.sort((l,r) => {
    let [ lprefix, lsuffix ] = l.split(token);
    let [ rprefix, rsuffix ] = r.split(token);
    return lsuffix.localeCompare(rsuffix);
  });

  return tags;
}

export class SmartTagFacet extends TagFacet {
  constructor(params) {
    super(params);

    let { prefix, prefixes, token } = params;

    prefixes = prefixes || [];
    if(prefix) prefixes.push(prefix);

    this.token = token || '_';
    this.prefixes = prefixes;
  }

  getOptions() {
    let options = super.getOptions();
    if(!this.prefixes || !this.prefixes.length) return options;
    return getTagsWithPrefixes(this.prefixes, options, this.token);
  }

  getVisibleOptions() {
    let options = super.getVisibleOptions();
    return getTagsWithPrefixes(this.prefixes, options, this.token);
  }

  getOptionName(option) {
    if(this.isOptionAll(option)) return super.getOptionName(option);
    let [ prefix, suffix ] = option.split(this.token);
    let prefixOption = this.prefixes.find(p => p.toLowerCase() == prefix.toLowerCase());
    if(!prefixOption) return null;
    return suffix;
  }
}
