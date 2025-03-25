import { OneFEServerOptions } from '../../types/one-fe-server';

export const serverOptions: OneFEServerOptions = {
  // points to common flat file
  mode: 'production',
  environment: 'production',
  orgName: 'OneFE Starter App',
  configManagement: {
    url: `https://cdn.jsdelivr.net/gh/docusign/mock-cdn-assets/common-configs/production.json`,
    refreshMs: 30 * 1000,
  },
  shellBundleUrl: 'http://localhost:3000/bundle.js',
  server: {
    // for Integration-env only
    bathtub: true, // automatically on when mode: development
    // known routes are routes that 1fe will NOT 404 on if the current route does not match a plugin
    knownRoutes: ['/test', '/version', '/'],
  },
};
