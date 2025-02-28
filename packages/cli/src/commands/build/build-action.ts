import { webpack } from 'webpack';
import { getWebpackConfig } from '../../configs/webpack/webpack.config';
import { BuildCommandOptions } from './build-command.types';
import { getLogger } from '../../utils/get-logger';
import { exitWith } from '../../utils/cli';

export const buildAction = async (buildOptions: BuildCommandOptions) => {
  // execute the below parallelly and wait for allSettled.
  const webpackBuild = buildWebpack(buildOptions);
  const contractsBuild = buildContracts(buildOptions);

  await Promise.allSettled([webpackBuild, contractsBuild]);
};

function buildWebpack(buildOptions: BuildCommandOptions) {
  return new Promise<void>((resolve) => {
    const logger = getLogger('[build]');
    const compiler = webpack(getWebpackConfig(buildOptions));

    // TODO - install contracts here

    compiler.run((error, stats) => {
      if (error || stats?.hasErrors()) {
        exitWith(1, () => {
          logger.error('Webpack errors found in build', {
            error,
            stats: stats?.compilation?.errors,
          });
        });
      }

      logger.info(
        'stats: ',
        stats?.toString({
          colors: true,
          logging: 'log', // this was 'summary' before. investigate this.
        }),
      );

      logger.log('🎉 Succesfully built your widget!');

      resolve();
    });
  });
}

async function buildContracts(buildOptions: BuildCommandOptions) {
  // TODO - implement this.
}
