import { Configuration as WebpackConfig } from 'webpack';

type GetDevtoolLayerOptions = {
  isProduction: boolean;
  enableDevServer: boolean;
};

export function getDevtoolLayer({
  isProduction,
  enableDevServer,
}: GetDevtoolLayerOptions): WebpackConfig {
  if (isProduction) {
    return {
      devtool: false,
    };
  } else if (enableDevServer) {
    return {
      devtool: 'cheap-module-source-map',
    };
  } else {
    return {
      devtool: 'source-map',
    };
  }
}
