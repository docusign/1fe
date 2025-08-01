import chalk from 'chalk';

/**
 * Gets the minimum Node.js version (injected at build time from .nvmrc)
 * @returns The major version number
 */
function getMinNodeVersion(): number {
  try {
    const version = process.env.MIN_NODE_VERSION || '22';
    const majorVersion = parseInt(version, 10);

    if (isNaN(majorVersion)) {
      console.warn(
        chalk.yellow(
          `Warning: Invalid Node version constant: ${version}. Using default minimum Node version 22.`,
        ),
      );
      return 22;
    }

    return majorVersion;
  } catch (error) {
    // Fallback to a reasonable default if something goes wrong
    console.warn(
      chalk.yellow(
        `Warning: Could not get minimum Node version. Using default minimum Node version 22.`,
      ),
    );
    return 22;
  }
}

/**
 * Checks if the current Node.js version meets the minimum requirement
 * @returns true if version is sufficient, false otherwise
 */
export function checkNodeVersion(): boolean {
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
 */
export function displayNodeVersionError(): never {
  const currentVersion = process.version;
  const minNodeVersion = getMinNodeVersion();

  console.error(
    chalk.red('🛑 Node.js version error!\n'),
    chalk.yellow(`Current version: ${currentVersion}\n`),
    chalk.yellow(`Minimum required version: ${minNodeVersion}.x.x\n\n`),
    chalk.white(
      `Please update Node.js to version ${minNodeVersion} or higher.\n`,
    ),
    chalk.cyan(
      'You can download the latest version from: https://nodejs.org/\n',
    ),
    chalk.cyan('Or use a Node.js version manager like nvm:\n'),
    chalk.gray(`  nvm install ${minNodeVersion}\n`),
    chalk.gray(`  nvm use ${minNodeVersion}\n`),
  );

  process.exit(1);
}

/**
 * Performs Node.js version check and exits if version is insufficient
 */
export function ensureNodeVersion(): void {
  if (!checkNodeVersion()) {
    displayNodeVersionError();
  }
}
