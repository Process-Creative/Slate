import * as program from 'commander';

import './cli/create';
import './cli/edit';
import './cli/install';
import './cli/theme';

program.parse(process.argv);