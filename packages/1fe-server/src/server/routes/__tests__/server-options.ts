export const serverOptions: any = {
  // points to common flat file
  environment: 'production',
  isProduction: true,
  orgName: 'OneFE Starter App',
  configManagement: {
    url: `https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/production.json`,
    refreshMs: 30 * 1000,
  },
  shellBundleUrl: 'http://localhost:3000/bundle.js',
  server: {
    // for Integration-env only
    bathtub: true,
    importMapOverrides: {
      cdnURL: '',
    },
    devtools: true,
    // known routes are routes that 1fe will NOT 404 on if the current route does not match a plugin
    knownRoutes: ['/test', '/version', '/'],
  },
  dynamicConfigs: {
    libraries: {
      basePrefix: 'https://docutest-a.akamaihd.net/production/1fe/libraries/',
    },
    widgets: {
      basePrefix: 'https://docutest-a.akamaihd.net/production/1fe/widgets/',
      configs: [
        {
          widgetId: '@test/widget',
          widgetVersion: '1.0.0',
        },
      ],
    },
  },
};
