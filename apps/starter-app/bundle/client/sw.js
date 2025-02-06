const { resolve } = require('path');
const { shouldUseDevelopmentMode } = require('./utils');
const tsConfigSW = resolve(__dirname, '../../tsconfig-sw.json');

const swConfig = {
  mode: shouldUseDevelopmentMode ? 'development' : 'production',
  devtool: shouldUseDevelopmentMode ? 'source-map' : false,
  entry: {
    sw: resolve(__dirname, '../../src/sw.ts'),
  },
  output: {
    path: resolve(__dirname, '../../dist/public'),
    filename: '[name].js',
    publicPath: '',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: tsConfigSW,
          },
        },
      },
    ],
  },
};

module.exports = swConfig;
