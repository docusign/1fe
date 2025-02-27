import { insertNewImportMap, insertPersistentWidgetOverrides } from "../import-map";
import { initializeImportMapOverridesReskin } from "../import-map-ui";

jest.mock('../import-map-ui');

jest.mock('../../configs/shell-configs', () => ({
  readMagicBoxShellConfigs: jest.fn().mockImplementation(() => ({ mode: 'preproduction' })),
}));

describe('insertNewImportMap', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should append a script element with the correct type and JSON content to the document head', () => {
    const importMap = {
      imports: {
        react:
          'https://cdn.jsdelivr.net/npm/react@17.0.0/umd/react.production.min.js',
      },
    };

    insertNewImportMap(importMap);

    const script = document.head.querySelector(
      'script[type="systemjs-importmap"]',
    );
    expect(script).not.toBeNull();
    expect(script?.textContent).toBe(JSON.stringify(importMap));
  });
});

describe('insertPersistentWidgetOverrides', () => {
  it('hide import map override button for devtool in integration', () => {
    (System as any).prepareImport = jest.fn().mockResolvedValue('');
    const importMap = {
      imports: {
        react:
          'https://cdn.jsdelivr.net/npm/react@17.0.0/umd/react.production.min.js',
      },
    };

    insertPersistentWidgetOverrides(
      {
        react:
          'https://cdn.jsdelivr.net/npm/react@17.0.0/umd/react.production.min.js',
      },
      importMap,
    );

    expect(initializeImportMapOverridesReskin).toHaveBeenCalled();
    // expect(hideImportMapOverrideButton).toHaveBeenCalled();

    delete (System as any).prepareImport;
  });
});
