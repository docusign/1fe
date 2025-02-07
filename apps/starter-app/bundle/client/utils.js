const { DefinePlugin } = require('webpack');

const BUILD_BUILDID = process.env.BUILD_BUILDID;
const DEBUG_BUILD = process.env.DEBUG_BUILD === 'true';
const IS_TEST_RUN = process.env.IS_TEST_RUN;
const IS_AUTOMATION_RUN = process.env.IS_AUTOMATION_RUN;

const showDevtoolBasedOnEnvironment = process.env.NODE_ENV === 'development' || DEBUG_BUILD;

const commonPlugins = [
  new DefinePlugin({
    // We use isProductionEnvironment because we allow the devtool on stage
    __SHOW_DEVTOOL__: JSON.stringify(showDevtoolBasedOnEnvironment),
    __ENABLE_SERVICE_WORKER__: JSON.stringify(
      process.env.ENABLE_SERVICE_WORKER,
    ),
  }),
];

module.exports = {
  commonPlugins,
  BUILD_BUILDID,
  DEBUG_BUILD,
  IS_TEST_RUN,
  IS_AUTOMATION_RUN
};