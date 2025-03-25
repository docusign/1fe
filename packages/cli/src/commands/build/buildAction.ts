import { webpack } from 'webpack';
import { getWebpackConfig } from '../../configs/webpack/webpack.config';
import { BuildCommandOptions } from './buildCommand.types';
import { contractsInstallAction } from '../contracts/install/contractsInstallAction';
import { oneFeProgram } from '../../oneFeProgram/oneFeProgram';
import { getLogger } from '../../lib/getLogger';
import { contractsGenerateAction } from '../contracts/generate/contractsGenerateAction';
import { getConfig } from '../../lib/config/getConfig';

export const buildAction = async (buildOptions: BuildCommandOptions) => {
  await buildWebpack(buildOptions);
  await contractsGenerateAction();
};

async function buildWebpack(buildOptions: BuildCommandOptions) {
  return new Promise<void>(async (resolve, reject) => {
    const logger = getLogger('[build]');

    const environment = await oneFeProgram.getOptionValue('environment');

    const { webpackConfigs } = await getConfig();

    const compiler = webpack(
      await getWebpackConfig({
        mode: buildOptions.mode,
        isCI: oneFeProgram.getOptionValue('ci'),
        environment: buildOptions.liveVersionEnv || environment,
        overrides: webpackConfigs?.[environment],
        enableAnalyzer: buildOptions.analyze,
      }),
    );

    await contractsInstallAction();

    compiler.run((error, stats) => {
      if (error || stats?.hasErrors()) {
        logger.error('Webpack errors found in build', {
          error,
          stats: stats?.compilation?.errors,
        });

        reject();
      } else {
        logger.info(
          'stats: ',
          stats?.toString({
            colors: true,
            logging: 'log', // TODO - this was 'summary' before. investigate this.
          }),
        );

        logger.log('🎉 Succesfully built your widget!');

        resolve();
      }
    });
  });
}
