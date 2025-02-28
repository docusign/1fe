import { Configuration as WebpackConfig } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { getPaths } from '../../../utils/paths/paths';
import { isCI } from '../../../utils/env-helpers';

export function withAnalyzerPlugin(forceEnable = false): WebpackConfig {
  if (!isCI() || !forceEnable) return {};

  return {
    plugins: [
      new BundleAnalyzerPlugin({
        generateStatsFile: true,
        statsFilename: getPaths().webpack.analyzerPlugin.statsJson,
        reportFilename: getPaths().webpack.analyzerPlugin.reportHtml,
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
      }),
    ],
  };
}
