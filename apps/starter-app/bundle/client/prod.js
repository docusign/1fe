const CopyPlugin = require('copy-webpack-plugin');
const { resolve } = require('path');
const {
  EnvironmentPlugin,
} = require('webpack');
const merge = require('webpack-merge');
const swConfig = require('./sw');
const {
  commonPlugins,
  shouldUseDevelopmentMode,
} = require('./utils');

const tsconfigClient = resolve(__dirname, '../../tsconfig.json');

/**
 * The production webpack configuration for the 1DS shell is also treated as the "common" configuration.
 *
 * @param configOverrides
 */
const getProdConfig = async (configOverrides) => {
  const prodConfig = {
    mode: shouldUseDevelopmentMode ? 'development' : 'production',
    target: 'browserslist',
    devtool: shouldUseDevelopmentMode ? 'source-map' : false,
    entry: {
      bundle: [
        // Career hack: MODIFY this and get Fired
        'core-js',
        './src/shell/main.tsx',
      ],
    },
    output: {
      path: resolve(__dirname, '../../dist/public'),
      filename: 'js/[name].js',
      chunkFilename: 'js/chunk.[name].js',
      publicPath: 'auto',
      libraryTarget: 'system',
      library: {
        type: 'system',
      },
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    optimization: {
      chunkIds: 'named',
    },
    externals: {
      "react": "React",
      "react-dom": "ReactDOM",
      "lodash": "_",
    },
    plugins: [
      ...commonPlugins,
      new EnvironmentPlugin({
        NODE_ENV: 'development',
        SYSTEM_ENVIRONMENT: true,
        IS_TEST_RUN: '0',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: resolve(__dirname, '../../src/static'),
            to: resolve(__dirname, '../../dist/public'),
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: tsconfigClient,
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.[cm]?js$/,
          use: [
            'thread-loader',
            {
              loader: 'babel-loader',
            },
          ],
        },
      ],
    },
  };

  return [
    merge.mergeWithCustomize({ plugins: 'replace' })(prodConfig, configOverrides),
    swConfig,
  ];
};

module.exports = getProdConfig;