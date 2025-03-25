import { getLogger } from 'src/lib/getLogger';
import { DevCommandOptions } from './devCommand.types';
import { getWebpackConfig } from 'src/configs/webpack/webpack.config';
import { oneFeProgram } from 'src/oneFeProgram/oneFeProgram';
import { webpack } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getPorts from 'webpack-dev-server/lib/getPort';

const DEV_START_PORT = 8080;
const DEV_HOST = '127.0.0.1';

export async function devCommandAction(devCommandOptions: DevCommandOptions) {
  const { transpileOnly, headless, contractsInstall } = devCommandOptions;

  const logger = getLogger('[dev]');

  logger.debug('starting dev command with options:', devCommandOptions);

  const webpackConfig = await getWebpackConfig({
    transpileOnly,
    mode: 'development',
    environment: await oneFeProgram.getOptionValue('environment'),
    enableDevServer: true,
  });

  logger.debug('webpack config:', webpackConfig);

  if (contractsInstall) {
    logger.info('Installing contracts...');
    // TODO Call contracts installation function here
  }

  const port = await getPorts(DEV_START_PORT, DEV_HOST);
  const server = new WebpackDevServer(
    {
      ...webpackConfig.devServer,
      port,
    },
    webpack(webpackConfig),
  );

  logger.log(`Starting development server on ${DEV_HOST}:${port}`);

  try {
    await server.start();

    // TODO calculate bathtub URL here.

    if (headless) {
      // TODO do not open browser if headless is true
    }

    // TODO open browser.
    logger.log('Opening the widget in the bathtub...');
  } catch (e) {
    logger.error('Error starting development server:', e);
    process.exit(1);
  }
}
