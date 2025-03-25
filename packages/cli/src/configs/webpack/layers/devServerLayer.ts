import { merge } from 'lodash';
import { getLogger } from 'src/lib/getLogger';
import { Configuration as WebpackConfig } from 'webpack';

type DevServerLayerOptions = {
  enableDevServer?: boolean;
  devServerOverrides?: WebpackConfig['devServer'];
};

const devServerDefaults: WebpackConfig['devServer'] = {
  hot: true, // enable HMR on the server
  open: false,
  host: '127.0.0.1',
  historyApiFallback: true, // fixes error 404-ish errors when using react router :see this SO question: https://stackoverflow.com/questions/43209666/react-router-v4-cannot-get-url

  allowedHosts: 'all',
  // permissive headers for using local build in remote 1ds shell
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  },
};

export function getDevServerLayer({
  enableDevServer,
  devServerOverrides,
}: DevServerLayerOptions): WebpackConfig {
  if (!enableDevServer) return {};

  const logger = getLogger('[webpack][devServer]');

  logger.debug('Enabling dev server with overrides:', devServerOverrides);

  return {
    devServer: merge(devServerDefaults, devServerOverrides),
  };
}
