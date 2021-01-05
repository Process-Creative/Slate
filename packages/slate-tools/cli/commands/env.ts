import * as slateEnv from '@process-creative/slate-env';
import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));

slateEnv.create({ name: argv.env });
console.log('Generated your shiny new ENV file!');