#!/usr/bin/env node

import esMain from 'es-main';
import { createCommand } from './commands/create/create-command';

function run() {
  createCommand.parseAsync(process.argv).catch(console.error);
}

if (require.main === module || esMain(import.meta)) {
  run();
}

export { createCommand };
