export const serverOptions = {
    // points to common flat file
    mode: 'production',
    environment: 'production',
    orgName: 'MagicBox',
    configManagement: {
      url: `https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/production.json`,
      refreshMs: 30 * 1000,
      phasedRelease: true,
    },
    shellBundleUrl: 'http://localhost:3000/bundle.js',
    server: {
      // for Integration-env only
      bathtub: true, // automatically on when mode: development
      importMapOverrides: {
        cdnURL: '',
      },
      devtools: true, // automatically on when mode: development
      // known routes are routes that magic box will NOT 404 on if the current route does not match a plugin
      knownRoutes: ['/test', '/version', '/'],
    },
    dynamicConfigs: {
      cdn: {
        libraries: {
          basePrefix: 'https://docutest-a.akamaihd.net/production/1ds/libraries/'
        },
        widgets: {
          basePrefix: 'https://docutest-a.akamaihd.net/production/1ds/widgets/'
        }
      }
    }
  };