// Main application entry point (called by cli.js after node version check)
import esMain from 'es-main';
import { createCommand } from './commands/create/create-command';

function run() {
  createCommand.parseAsync(process.argv).catch(console.error);
}

// Always run when this module is loaded, since it's designed to be called by the CLI wrapper
// The CLI wrapper (cli.js) will only load this if Node version check passes
run();

export { createCommand };
