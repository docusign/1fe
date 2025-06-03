export const serverOptions: any = {
  // points to common flat file
  environment: 'production',
  isProduction: true,
  orgName: 'OneFE Starter App',
  configManagement: {
    widgetVersions: {
      url: `https://1fe-a.akamaihd.net/production/configs/widget-versions.json`,
    },
    libraryVersions: {
      url: `https://1fe-a.akamaihd.net/production/configs/lib-versions.json`,
    },
    dynamicConfigs: {
      url: `https://1fe-a.akamaihd.net/production/configs/live.json`,
    },
    refreshMs: 30 * 1000,
  },
  criticalLibUrls: {
    importMapOverride:
      'https://1fe-a.akamaihd.net/production/libs/@1fe/import-map-overrides/3.1.1/dist/import-map-overrides.js',
    systemJS: `https://1fe-a.akamaihd.net/production/libs/systemjs/6.14.0/dist/system.min.js`,
    systemJSAmd: `https://1fe-a.akamaihd.net/production/libs/systemjs/6.14.0/dist/extras/amd.min.js`,
    shellBundleUrl: `http://localhost:3001/js/bundle.js`,
  },
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
