import { buildContractFile } from '../contract';
import { FileSystem } from '../files';
import type { WidgetId } from '../types';

const sampleRoot = '/sample/src/types';
const sampleUrl =
  'https://docutest-a.akamaihd.net/integration/1ds/widgets/@shared/filter-bar/1.0.62/types/contract.rolledUp.d.ts';
let mockedContracts: Map<string, string> = new Map([]);

jest.mock('fs-extra', () => ({
  ...jest.requireActual('fs-extra'),
  ensureDir: jest.fn(),
  ensureFile: jest.fn(),
  readFile: (path: string): Promise<string> => {
    const mockPath = path.split('/widgets/')[1];
    const file = mockedContracts.get(mockPath);
    return file ? Promise.resolve(file) : Promise.reject();
  },
}));
jest.mock('../../fs', () => ({
  getFiles: async function* getFiles() {
    const paths = Array.from(mockedContracts.keys()).map(
      (p) => `${sampleRoot}/widgets/${p}`,
    );
    for (const path of paths) yield path;
  },
}));

describe('FileSystem', () => {
  beforeEach(() => {
    mockedContracts = new Map([]);
  });

  describe('constructor', () => {
    it('initializes static paths', () => {
      const fileSytem = new FileSystem(sampleRoot);
      expect(fileSytem.widgetTypesPath).toEqual(`${sampleRoot}/widgets`);
      expect(fileSytem.widgetGlobalsPath).toEqual(
        `${sampleRoot}/widgets/index.d.ts`,
      );
    });
  });

  describe('resolveWidgetContractPath', () => {
    it.each([
      ['@ds/send' as WidgetId, 'ds/send.d.ts'],
      ['@shared/filter-bar' as WidgetId, 'shared/filterBar.d.ts'],
      ['@core/widget-starter-kit' as WidgetId, 'core/widgetStarterKit.d.ts'],
    ])(
      'resolves namespaces to directories with camelcasing',
      (widgetId, endPath) => {
        const fileSystem = new FileSystem(sampleRoot);
        const contractPaths = fileSystem.widgetTypesPath;
        const expectedPath = `${contractPaths}/${endPath}`;

        expect(fileSystem.resolveWidgetContractPath(widgetId)).toEqual(
          expectedPath,
        );
      },
    );
  });

  describe('resolveWidgetContracts', () => {
    it('reads all parse-able contracts in the repo', async () => {
      mockedContracts = new Map([
        [
          'shared/filterBar.d.ts',
          buildContractFile(sampleUrl, 'export type HostPropsContract {};'),
        ],
        ['shared/fakeBroken.d.ts', 'unknown file content'],
      ]);

      const fileSystem = new FileSystem(sampleRoot);
      const contracts = await fileSystem.readWidgetContracts();

      expect(contracts).toEqual([
        expect.objectContaining({
          path: `${sampleRoot}/widgets/shared/filterBar.d.ts`,
        }),
      ]);
    });
  });
});
