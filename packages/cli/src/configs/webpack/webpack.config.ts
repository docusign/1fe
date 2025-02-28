import { DefinePlugin, Configuration as WebpackConfig } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import WebpackBar from 'webpackbar';
import { merge } from 'webpack-merge';
import { withAnalyzerPlugin } from './layers/analyzerPlugin';
import { isCI } from '../../utils/env-helpers';
import { buildCommand } from '../../commands/build/build-command';
import { resolve } from 'path/posix';
import { getPaths } from '../../utils/paths/paths';
import { BuildCommandOptions } from '../../commands/build/build-command.types';

export function getWebpackConfig(
  buildOptions: BuildCommandOptions, // TODO - should --dev command be just build command with --dev flag?
): WebpackConfig {
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
  ]; // TODO - add custom extensions here.

  const isProduction = buildOptions.mode === 'production';
  const isDevelopment = buildOptions.mode === 'development';

  const shouldTranspileOnly = buildOptions.transpileOnly && buildOptions.dev;

  return merge(
    {
      entry: {
        '1fe-bundle.js': getPaths().widgetEntry,
      },
      target: 'broweserslist',
      mode: buildOptions.mode as WebpackConfig['mode'],
      devtool: isProduction ? false : 'source-map',
      resolve: {
        // alias: {
        //   '@1ds/shell': false,
        // },
        extensions,
        plugins: [
          new TsconfigPathsPlugin({
            configFile: getPaths().tsconfig,
            extensions,
          }),
        ],
      },
      plugins: [
        new WebpackBar({
          color: '#4b00fe', // Docusign Purple
          fancy: !isCI(),
          basic: isCI(),
        }),
        new DefinePlugin({
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
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
                  transpileOnly: shouldTranspileOnly,
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
    // TODO add a layer for prodSourceMap
    // TODO - add variants and scenes entry as layers
    withAnalyzerPlugin(),
  );
}
