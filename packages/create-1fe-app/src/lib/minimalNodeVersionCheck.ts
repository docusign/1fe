/**
 * Minimal Node.js version check using only core modules
 * This must run before any external module imports
 */

// This constant is injected at build time from .nvmrc
declare const process: any;

/**
 * Gets the minimum Node.js version (injected at build time from .nvmrc)
 */
function getMinNodeVersion(): number {
  try {
    const version = process.env.MIN_NODE_VERSION || '22';
    const majorVersion = parseInt(version, 10);

    if (isNaN(majorVersion)) {
      console.warn(
        `Warning: Invalid Node version constant: ${version}. Using default minimum Node version 22.`,
      );
      return 22;
    }

    return majorVersion;
  } catch (error) {
    console.warn(
      `Warning: Could not get minimum Node version. Using default minimum Node version 22.`,
    );
    return 22;
  }
}

/**
 * Checks if the current Node.js version meets the minimum requirement
 */
function checkNodeVersion(): boolean {
  const currentVersion = process.version;
  const currentMajorVersion = parseInt(
    currentVersion.slice(1).split('.')[0],
    10,
  );

  const minNodeVersion = getMinNodeVersion();
  return currentMajorVersion >= minNodeVersion;
}

/**
 * Displays an error message for insufficient Node.js version and exits the process
 * Uses only console methods (no chalk dependency)
 */
function displayNodeVersionError(): never {
  const currentVersion = process.version;
  const minNodeVersion = getMinNodeVersion();

  console.error('🛑 Node.js version error!\n');
  console.error(`Current version: ${currentVersion}\n`);
  console.error(`Minimum required version: ${minNodeVersion}.x.x\n\n`);
  console.error(
    `Please update Node.js to version ${minNodeVersion} or higher.\n`,
  );
  console.error(
    'You can download the latest version from: https://nodejs.org/\n',
  );
  console.error('Or use a Node.js version manager like nvm:\n');
  console.error(`  nvm install ${minNodeVersion}\n`);
  console.error(`  nvm use ${minNodeVersion}\n`);

  return process.exit(1) as never;
}

/**
 * Performs Node.js version check and exits if version is insufficient
 */
export function ensureMinimalNodeVersion(): void {
  if (!checkNodeVersion()) {
    displayNodeVersionError();
  }
}
