import { DefinePlugin, Configuration as WebpackConfig } from 'webpack';
import SystemJSPublicPathWebpackPlugin from 'systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin';
import WebpackBar from 'webpackbar';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { getKnownPaths } from 'src/lib/paths/getKnownPaths';

type GetPluginsLayerParams = {
  enableAnalyzer: boolean;
  enableDevServer: boolean;
  isCI: boolean;
};

export function getPluginsLayer({
  enableAnalyzer,
  enableDevServer,
  isCI,
}: GetPluginsLayerParams): WebpackConfig {
  const analyzerPlugin =
    isCI || enableAnalyzer ? getBundleAnalyzerPlugin() : undefined;

  const reactRefreshPlugin = enableDevServer
    ? new ReactRefreshPlugin()
    : undefined;

  return {
    plugins: [
      analyzerPlugin,
      reactRefreshPlugin,
      new DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }),
      new WebpackBar({
        color: '#4b00fe', // Docusign Purple
        fancy: !isCI,
        basic: isCI,
      }),
      new SystemJSPublicPathWebpackPlugin({
        /**
         * If you need the webpack public path to "chop off" some of the directories in the current module's url, you can specify a "root directory level".
         * Note that the root directory level is read from right-to-left, with `1` indicating "current directory" and `2` indicating "up one directory":
         */
        rootDirectoryLevel: 2,
      }),
    ].filter(Boolean),
  };
}

/**
 * A function that returns a new instance of the BundleAnalyzerPlugin with specific options.
 * We use a getter function instead of a pre-made varible to allow usage of command options within the object passed to the plugin's constructor.
 */
function getBundleAnalyzerPlugin() {
  return new BundleAnalyzerPlugin({
    generateStatsFile: true,
    statsFilename: getKnownPaths().webpack.analyzerPlugin.statsJson,
    reportFilename: getKnownPaths().webpack.analyzerPlugin.reportHtml,
    analyzerMode: 'static',
    openAnalyzer: false,
    statsOptions: {
      // https://github.com/statoscope/statoscope/tree/master/packages/webpack-plugin#which-stats-flags-statoscope-use
      // Required
      all: false, // disable all the stats
      hash: true, // compilation hash
      entrypoints: true, // entrypoints
      chunks: true, // chunks
      chunkModules: true, // modules
      reasons: true, // modules reasons,
      ids: true, // IDs of modules and chunks (webpack 5)

      // nice to have
      nestedModules: true, // concatenated modules
      usedExports: true, // used exports
      providedExports: true, // provided imports
      assets: true, // assets
      chunkOrigins: true, // chunks origins stats (to find out which modules require a chunk)
      version: true, // webpack version
      builtAt: true, // build at time
      timings: true, // modules timing information
      performance: true, // info about oversized assets

      // https://github.com/relative-ci/bundle-stats/tree/master/packages/webpack-plugin#bundlestatswebpackpluginoptions
      modules: true,
    },
  });
}
