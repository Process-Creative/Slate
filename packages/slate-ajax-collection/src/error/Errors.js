import * as Consts from './../constant/Constants';

export const CONTAINER_INVALID = 'Container for AjaxCollection is not a valid jQuery object, likely incorrect selector or does not exist on page.';
export const CONTAINER_INITIALZED = 'Container for AjaxCollection has already been initialized, cannot attempt to create two ajax collections on one container at this stage.';

export const MISSING_COLLECTION_HANDLE = `AjaxCollection Container is missing ${Consts.COLLECTION_HANDLE_ATTR} attribute with collection handle.`;
export const MISSING_COLLECTION_PAGE_COUNT = `AjaxCollection Container is missing ${Consts.COLLECTION_HANDLE_PER_PAGE} attribute with count of items per-page. This must also match the collection.json.liquid template count and the collection.template count.`;
export const MISSING_PRODUCT_CONTAINER = `Could not find the products container, make sure you have one setup with the ${Consts.PRODUCTS_CONTAINER_SELECTOR} attribute.`;
export const MISSING_JSON_CONTAINER = `Could not find the collection JSON information, make sure you have included it with the ${Consts.JSON_CONTAINER_SELECTOR} attribute.`;

export const MISSING_PRODUCT_DATA = `Invalid Collection JSON (Missing Products)`;
export const MISSING_PAGE_DATA = `Invalid Collection JSON (Missing Page)`;
export const MISSING_ALL_TAGS_DATA = `Invalid Collection JSON (Missing all_tags)`;

export const CACHE_NOT_ARRAY = 'Invalid Product Cache (Not an array?)';
export const CACHE_LOAD_FAILED = 'Failed to load data from product cache';
export const CACHE_SAVE_FAILED = 'Failed to save data to the product cache';
export const CACHE_CLEAR_FAILED = 'Failed to clear the product cache!';
export const CACHE_DATE_FUTURE = 'Invalid Product Cache (Stored data from the future?)'
export const CACHE_DATE_FAILED = 'Failed to read product cache date';

export const DISPLAY_MODE_INVALID = 'You are trying to use an invalid display mode, AjaxCollection will default to First Available Variant.';

export const FETCH_FAILED = 'Failed to fetch and load products, see below error for details';

export const MISSING_FILTER_HANDLE = 'You must provide a valid handle for your filter.';
export const MISSING_FILTER_TEMPLATE = 'You must provide the AjaxCollectionTemplate for your filter.';

export const MISSING_FACET_TEMPLATE = 'You must provide the AjaxCollectionTemplate for your facet.';
export const MISSING_FACET_FILTER = 'You must provide the filter for your facet to control.';
export const MISSING_FACET_CONTAINER = 'You must provide the jQuery container for your facet.';
export const MISSING_FACET_TITLE = 'Please provide a human readable title for your facet.';
