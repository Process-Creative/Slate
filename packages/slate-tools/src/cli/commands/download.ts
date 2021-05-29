import { download } from "../../shopify/sync";
import { slateToolsConfig } from './../../schema';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';

mkdirp.sync(slateToolsConfig.get('paths.theme.download'));

console.log('Downloading...');
download().then(e => {
}).catch(e => {
  console.error('Error', e)
});