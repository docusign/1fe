#!/usr/bin/env node

import esMain from 'es-main';
import { rootCommand } from './root-command/root-command';

function run() {
  rootCommand.parseAsync(process.argv).catch(console.error);
}

if (require.main === module || esMain(import.meta)) {
  run();
}
