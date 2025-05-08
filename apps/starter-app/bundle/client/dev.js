const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { EnvironmentPlugin, HotModuleReplacementPlugin } = require('webpack');

const { isUndefined } = require('lodash');
const getProdConfig = require('./prod');
const { commonPlugins } = require('./utils');

/**
 * This config is used for local development of the 1FE shell.
 * Remote development mode builds are handled internally by getProdConfig.
 */
const config = getProdConfig({
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    hot: true,
    open: !process.env.IS_TEST_RUN,
    client: { overlay: { errors: true, warnings: false }, logging: 'info' },
    historyApiFallback: true, // fixes error 404-ish errors when using react router :see this SO question: https://stackoverflow.com/questions/43209666/react-router-v4-cannot-get-url
    allowedHosts: 'all',
    proxy: {
      '*': {
        target: 'http://localhost:3000',
        logLevel: 'debug',
        changeOrigin: true,
        secure: false,
      },
      context: () => true,
    },
    devMiddleware: {
      index: false,
      mimeTypes: { png: 'image/png' },
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
    'react-router-dom': 'ReactRouterDOM',
    '@remix-run/router': 'RemixRouter',
    lodash: '_',
  },
  plugins: [
    ...commonPlugins,
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      IS_TEST_RUN: isUndefined(process.env.IS_TEST_RUN)
        ? '0'
        : process.env.IS_TEST_RUN,
    }),
    new ProgressBarPlugin({
      total: 20,
      format: `build [:bar] :percent (:elapsed seconds)`,
      clear: true,
    }),
  ],
});

module.exports = config;
