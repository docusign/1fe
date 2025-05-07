import { getLogger } from 'src/lib/getLogger';
import { DevCommandOptions } from './devCommand.types';
import { getWebpackConfig } from 'src/configs/webpack/webpack.config';
import { oneFeProgram } from 'src/oneFeProgram/oneFeProgram';
import { webpack } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getPorts from 'webpack-dev-server/lib/getPort';
import { getConfig } from 'src/lib/config/getConfig';
import open from 'open';
import { contractsInstallAction } from '../contracts/install/contractsInstallAction';
import chalk from 'chalk';

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
    await contractsInstallAction({ outdated: false });
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

    server.compiler.hooks.done.tap('done', async () => {
      const {
        baseConfig: { bathtubUrl },
      } = await getConfig();

      if (bathtubUrl) {
        if (!headless) {
          const bathtubUrlObject = new URL(bathtubUrl);
          bathtubUrlObject.searchParams.set(
            'widgetUrl',
            `http://${DEV_HOST}:${port}/js/1fe-bundle.js`,
          );
          logger.log(
            `Opening the widget in the bathtub with the URL: \n\t${chalk.blue(bathtubUrlObject.href)}\n`,
          );
          open(bathtubUrlObject.href);
        } else {
          logger.log('💀 The browser has been beheaded as instructed.');
        }
      }
    });
  } catch (e) {
    logger.error('Error starting development server:', e);
    process.exit(1);
  }
}
