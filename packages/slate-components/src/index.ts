import * as program from 'commander';

import './cli/create';
import './cli/edit';
import './cli/install';
import './cli/theme';
import './cli/validate';
import './cli/sign';

program.parse(process.argv);