import { DefinePlugin, Configuration as WebpackConfig } from 'webpack';
import SystemJSPublicPathWebpackPlugin from 'systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import WebpackBar from 'webpackbar';
import { mergeWithRules } from 'webpack-merge';
import { getBundleAnalyzerLayer } from './layers/getBundleAnalyzerLayer';
import { getKnownPaths } from '../../lib/paths/getKnownPaths';
import { WEBPACK_BUNDLES } from './webpack.constants';
import { getVariantsEntryLayer } from './layers/variants/variantsLayer';
import { getScenesLayer } from './layers/scenes/scenesLayer';
import { getExternalsLayer } from './layers/externals/externalsLayer';
import { getTargetLayer } from './layers/target/targetLayer';

type GetWebpackConfigOptions = {
  mode: WebpackConfig['mode'];
  transpileOnly?: boolean;
  isCI?: boolean;
  environment: string;
  overrides?: WebpackConfig;
};

const merge = mergeWithRules({
  plugins: 'prepend',
  output: 'replace',
  externals: 'append',
});

export async function getWebpackConfig({
  mode,
  transpileOnly,
  isCI = false,
  environment,
  overrides = {},
}: GetWebpackConfigOptions): Promise<WebpackConfig> {
  // All extensions that are supported by module loader plugins below are listed here.
  const extensions = [
    '.json',
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.css',
    '.scss',
    '.sass',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.svg',
  ];

  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';

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
    {
      mode: mode as WebpackConfig['mode'],
      devtool: isProduction ? false : 'source-map',
      resolve: {
        alias: {
          // TODO - add shell package alias here
        },
        extensions,
        plugins: [
          new TsconfigPathsPlugin({
            configFile: getKnownPaths().tsconfig,
            extensions,
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
      plugins: [
        new WebpackBar({
          color: '#4b00fe', // Docusign Purple
          fancy: !isCI,
          basic: isCI,
        }),
        new DefinePlugin({
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        }),
        new SystemJSPublicPathWebpackPlugin({
          /**
           * If you need the webpack public path to "chop off" some of the directories in the current module's url, you can specify a "root directory level".
           * Note that the root directory level is read from right-to-left, with `1` indicating "current directory" and `2` indicating "up one directory":
           */
          rootDirectoryLevel: 2,
        }),
      ],
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
    getBundleAnalyzerLayer({
      enabled: isCI,
    }),
    overrides,
  );
}
