export const IS_TEST_RUN = (): boolean => process.env['IS_TEST_RUN'] === '1';

export const getHostedOrSimulatedEnvironment = (env: string) => {
  if (IS_TEST_RUN()) {
    return (
      process.env?.PLAYWRIGHT_RELEASE_WIDGETS_CONFIG_ENV_TO_LOAD?.toLowerCase() ||
      env ||
      'production'
    );
  }

  return env;
};
