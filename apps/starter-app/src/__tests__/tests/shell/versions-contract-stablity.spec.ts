import { test, expect } from '@playwright/test';
import { z } from 'zod';

const semverSchema = z.string().regex(
  // Matches semver versions with optional pre-release and build metadata
  /^v{0,1}\d+\.\d+\.\d+(-[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*)?$/,
  'Must be a valid semver version',
);

const widgetIdSchema = z.string().regex(
  // Matches widgets that follow the @org-name/package-name format
  /^@[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/,
  'Must be a valid widgetId',
);

const pluginRouteSchema = z.string().regex(
  // Matches routes that follow the /package-name format
  /^\/[a-zA-Z0-9-]+$/,
  'Must be a valid plugin route',
);

const packageSchema = z.strictObject({
  id: z.string(),
  version: semverSchema,
  name: z.string(),
});

const installedPackageSchema = z.strictObject({
  id: z.string(),
  version: semverSchema,
});

const widgetSchema = z.object({
  widgetId: z.string(),
  version: z.string(),
});

const pluginSchema = z.object({
  enabled: z.boolean(),
  route: pluginRouteSchema,
  widgetId: widgetIdSchema,
});

// TODO[1fe][post-mvp]: Adjust branch, gitSha, buildNumber when consuming back.
const versionSchema = z.strictObject({
  environment: z.string(),
  version: semverSchema,
  nodeVersion: semverSchema,
  // the next 3 fields are only available in non-prod environments
  buildNumber: z.string(),
  branch: z.string(),
  gitSha: z.string(),
  packages: z.object({
    externals: z.array(packageSchema).nonempty(),
    installed: z.array(installedPackageSchema).nonempty(),
  }),
  configs: z.object({
    widgetConfig: z.array(widgetSchema).nonempty(),
    pluginConfig: z.array(pluginSchema).nonempty(),
  }),
  hashOfWidgetConfigs: z.string(),
});

// The versions endpoint is used by shell, CLI, widgets etc to determine the right version of libraries and widgets
// Keeping the contract stable is critical to the 1ds ecosystem. Changes to the contract should be done with care.
test('endpoint contract is stable @version', async ({ request }) => {
  const url = 'http://localhost:3001/version';

  const response = await request.get(url);
  const versionJson = await response.json();

  const result = versionSchema.parse(versionJson);
  expect(result).toBeDefined();

  const externals = result.packages.externals.map(
    (e) => `${e.name}@${e.version}`,
  );
  const installed = result.packages.installed.map(
    (e) => `${e.id}@${e.version}`,
  );
  const widgetIds = result.configs.widgetConfig.map(
    (e) => `${e.widgetId}@${e.version}`,
  );
  const pluginIds = result.configs.pluginConfig.map(
    (e) => `${e.widgetId} => ${e.route}`,
  );

  expect(externals.length).toBeTruthy();
  expect(installed.length).toBeTruthy();
  expect(widgetIds.length).toBeTruthy();
  expect(pluginIds.length).toBeTruthy();
});

test.describe('Version endpoint enhancements', () => {
  const widgetVersionSchema = z.strictObject({
    id: widgetIdSchema,
    url: z.string(),
    version: semverSchema,
    bundle: z.string(),
    contract: z.string(),
  });

  const createRequestUrl = (widgetId: string, version: string | undefined) => {
    return `http://localhost:3001/version/${widgetId}/${version}`;
  };

  test.describe('Testing /version/:widgetId', () => {
    test('should return a 400 if the widgetId is invalid', async ({
      request,
    }) => {
      const url = createRequestUrl('invalid/widget-id', '1.0.0');
      const response = await request.get(url, {
        headers: {
          'User-Agent': '1fe-automation',
        },
      });
      expect(response.status()).toBe(400);
    });

    test('should return the "current" version of the widget', async ({
      request,
    }) => {
      const url = createRequestUrl('@1fe/starter-kit', 'current');
      const response = await request.get(url, {
        headers: {
          'User-Agent': '1fe-automation',
        },
      });
      expect(response.status()).toBe(200);

      const result = await response.json();
      expect(result).toBeDefined();

      const widgetVersion = widgetVersionSchema.parse(result);
      expect(widgetVersion).toBeDefined();
      expect(widgetVersion.id).toBe('@1fe/starter-kit');
      expect(widgetVersion.url).toContain('@1fe/starter-kit');
      expect(widgetVersion.bundle).toContain('1fe-bundle.js');
      expect(widgetVersion.contract).toContain('contract.rolledUp.d.ts');
    });
  });

  test.describe('Testing /version/:widgetId/:version', () => {
    test('should return a 400 if using non-current version', async ({
      request,
    }) => {
      const url = createRequestUrl('@1fe/starter-kit', '1.0.0');
      const response = await request.get(url, {
        headers: {
          'User-Agent': '1fe-automation',
        },
      });

      expect(response.status()).toBe(400);
    });
  });

  test.describe('Testing /version/:widgetId/:version/bundle', () => {
    test('should return a 400 if using non-current version', async ({
      request,
    }) => {
      const url = createRequestUrl('@1fe/starter-kit', '1.0.0');
      const response = await request.get(url, {
        headers: {
          'User-Agent': '1fe-automation',
        },
      });
      expect(response.status()).toBe(400);
    });

    test('should return the "current" version of the widget', async ({
      request,
    }) => {
      const url = createRequestUrl('@1fe/starter-kit', 'current');
      const response = await request.get(`${url}/bundle`, {
        headers: {
          'User-Agent': '1fe-automation',
        },
      });
      expect(response.status()).toBe(200);
    });
  });
});
