import { Option } from 'commander';

import action from './action';

const command = 'dummy';

const optionsToAction = [

  new Option(
    '--silent,',
    'disable console logs',
  ).default(false),
];

export default {
  command,
  description: 'dummy command for 1FE cli',
  action,
  optionsToAction,
};

