import { defineConfig } from 'tsup';
import { baseConfig } from '../../tsup.config.base';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Read .nvmrc file at build time
function getMinNodeVersionFromNvmrc(): string {
  try {
    const nvmrcPath = join(__dirname, '../../.nvmrc');
    const nvmrcContent = readFileSync(nvmrcPath, 'utf8').trim();

    // Extract major version (e.g., "22.13.0" -> "22")
    const majorVersion = nvmrcContent.split('.')[0];

    if (!majorVersion || isNaN(parseInt(majorVersion, 10))) {
      throw new Error(`Invalid version format in .nvmrc: ${nvmrcContent}`);
    }

    return majorVersion;
  } catch (error) {
    console.warn(
      `Warning: Could not read .nvmrc file during build. Using default version 22.`,
    );
    return '22';
  }
}

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts'],
  format: ['cjs'],
  target: 'es2022',
  shims: true,
  define: {
    'process.env.MIN_NODE_VERSION': JSON.stringify(
      getMinNodeVersionFromNvmrc(),
    ),
  },
  onSuccess: async () => {
    // Copy and process the CLI wrapper
    const cliSource = readFileSync(join(__dirname, 'src/cli.js'), 'utf8');
    const minNodeVersion = getMinNodeVersionFromNvmrc();

    // Replace the ENTIRE pattern with just the version, regardless of fallback value
    const processedCli = cliSource.replace(
      /process\.env\.MIN_NODE_VERSION \|\| '[^']*'/g,
      `'${minNodeVersion}'`,
    );

    writeFileSync(join(__dirname, 'dist/cli.js'), processedCli);
    console.log('✅ CLI wrapper processed and copied');
  },
});
