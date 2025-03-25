import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration as WebpackConfig } from 'webpack';
import { mergeWithRules } from 'webpack-merge';
import { getKnownPaths } from '../../lib/paths/getKnownPaths';
import { getExternalsLayer } from './layers/externalsLayer';
import { getPluginsLayer } from './layers/getPluginsLayer';
import { getScenesLayer } from './layers/scenesLayer';
import { getTargetLayer } from './layers/targetLayer';
import { getVariantsEntryLayer } from './layers/variants/variantsLayer';
import { EXTENSIONS, WEBPACK_BUNDLES } from './webpack.constants';
import { getDevServerLayer } from './layers/devServerLayer';
import { getDevtoolLayer } from './layers/getDevtoolLayer';

type GetWebpackConfigOptions = {
  mode: WebpackConfig['mode'];
  transpileOnly?: boolean;
  isCI?: boolean;
  environment: string;
  overrides?: WebpackConfig;
  enableAnalyzer?: boolean;
  enableDevServer?: boolean;
};

const merge = mergeWithRules({
  plugins: 'prepend',
  output: 'replace',
  externals: 'append',
});

export async function getWebpackConfig({
  mode,
  transpileOnly,
  environment,
  enableAnalyzer = false,
  isCI = false,
  overrides = {},
  enableDevServer = false,
}: GetWebpackConfigOptions): Promise<WebpackConfig> {
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

  const {
    devServer: devServerOverrides,
    entry,
    output,
    ...allowedOverrides
  } = overrides;

  return merge(
    {
      entry: {
        [WEBPACK_BUNDLES.MAIN]: getKnownPaths().webpack.widgetEntry,
      },
    },
    await getVariantsEntryLayer(),
    getScenesLayer(),
    await getExternalsLayer(environment),
    await getTargetLayer(environment),
    getPluginsLayer({
      enableAnalyzer: isCI || enableAnalyzer,
      enableDevServer,
      isCI,
    }),
    getDevServerLayer({
      enableDevServer,
      devServerOverrides,
    }),
    getDevtoolLayer({
      enableDevServer,
      isProduction,
    }),
    {
      mode: mode as WebpackConfig['mode'],
      devtool: isProduction ? false : 'source-map',
      resolve: {
        alias: {
          '@devhub/1fe-shell': '1feContext',
        },
        extensions: EXTENSIONS,
        plugins: [
          new TsconfigPathsPlugin({
            configFile: getKnownPaths().tsconfig,
            extensions: EXTENSIONS,
          }),
        ],
      },
      output: {
        filename: 'js/[name].js',
        path: getKnownPaths().distDir,
        publicPath: '/',
        clean: true,
        library: {
          type: 'system',
        },
      },
      module: {
        rules: [
          {
            test: /\.([cm]?ts|tsx)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: {
                  sourceType: 'unambiguous',
                  presets: ['@babel/preset-env'],
                  plugins: isDevelopment
                    ? [require.resolve('react-refresh/babel')]
                    : [],
                },
              },
              {
                loader: require.resolve('ts-loader'),
                options: {
                  transpileOnly,
                },
              },
            ],
          },
          {
            test: /\.(css|scss|sass)$/,
            exclude: /node_modules/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: {
                    localIdentName: isProduction
                      ? '[hash:base64]'
                      : '[path][name]__[local]--[hash:base64:5]',
                  },
                },
              },
              require.resolve('sass-loader'),
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  postcssOptions: {
                    plugins: ['autoprefixer'],
                  },
                },
              },
            ],
          },
          {
            test: /\.(jpe?g|png|svg)$/i,
            type: 'asset',
          },
        ],
      },
    },
    allowedOverrides,
  );
}
