#!/usr/bin/env node

/**
 * CLI entry point - checks Node version before loading main application
 * This file uses only core Node.js modules to avoid import issues on older Node versions
 */

// Get minimum Node version injected at build time
const MIN_NODE_VERSION = process.env.MIN_NODE_VERSION || '22';

/**
 * Check if current Node version meets minimum requirement
 */
function checkNodeVersion() {
  const currentVersion = process.version;
  const currentMajorVersion = parseInt(
    currentVersion.slice(1).split('.')[0],
    10,
  );
  const minNodeVersion = parseInt(MIN_NODE_VERSION, 10);

  return currentMajorVersion >= minNodeVersion;
}

/**
 * Display error and exit if Node version is insufficient
 */
function displayNodeVersionError() {
  const currentVersion = process.version;
  const minNodeVersion = parseInt(MIN_NODE_VERSION, 10);

  console.error('🛑 Node.js version error!\n');
  console.error(`Current version: ${currentVersion}`);
  console.error(`Minimum required version: ${minNodeVersion}.x.x\n`);
  console.error(
    `Please update Node.js to version ${minNodeVersion} or higher.\n`,
  );
  console.error(
    'You can download the latest version from: https://nodejs.org/',
  );
  console.error('Or use a Node.js version manager like nvm:');
  console.error(`  nvm install ${minNodeVersion}`);
  console.error(`  nvm use ${minNodeVersion}`);

  process.exit(1);
}

// Check Node version first
if (!checkNodeVersion()) {
  displayNodeVersionError();
}

// If version is OK, load and run the main application
try {
  require('./index.js');
} catch (error) {
  console.error('❌ Failed to start application:', error.message);
  process.exit(1);
}
