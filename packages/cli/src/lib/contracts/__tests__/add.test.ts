import { fetchWithTimeout } from '../../network/network';
import { addOrUpgradeContract } from '../add';
import { FileSystem } from '../files';
import { findLiveContractVersion } from '../versions';
import { getWidgetContractCdnUrl } from '../url';
import { buildContractFile } from '../contract';

jest.mock('fs-extra');
jest.mock('../files');
jest.mock('../url', () => ({
  getWidgetContractCdnUrl: jest.fn().mockResolvedValue({
    defaultUrl: 'https://cdn.com/contract.rolledUp.d.ts',
    defaultInVariantFolder: 'https://cdn.com/contracts/contract.rolledUp.d.ts',
  }),
}));
jest.mock('../../network');
jest.mock('../versions');
jest.mock('../registry');
jest.mock('../contract');

describe('addOrUpgradeContract', () => {
  describe('add', () => {
    beforeEach(() => {
      jest.mocked(FileSystem).mockImplementation(() => {
        return {
          ...jest.requireActual('../files').FileSystem,
          resolveWidgetContractPath: jest.fn(),
          buildContractFile: jest.fn(),
          readWidgetContract: jest.fn(() => {
            return null;
          }),
        };
      });
    });
    it('should return widget not found on failed findLiveContractVersion ', async () => {
      jest.mocked(findLiveContractVersion).mockReturnValue(undefined);

      const result = await addOrUpgradeContract('@live/add', 'integration');

      expect(result[0]).toEqual({
        type: 'WidgetNotFoundResult',
        widgetId: '@live/add',
      });
    });
    it('should return widget contract not found if both locations return non 200 codes', async () => {
      jest.mocked(findLiveContractVersion).mockReturnValue('liveVersion');
      jest.mocked(fetchWithTimeout).mockResolvedValue({
        status: 404,
        text: () => 'contract',
      } as unknown as globalThis.Response);

      const result = await addOrUpgradeContract(
        '@live/add',
        'integration',
        '1.0.0',
      );

      expect(result[0]).toEqual({
        type: 'WidgetContractNotFoundResult',
        widgetId: '@live/add',
        expectedUrl: 'https://cdn.com/contract.rolledUp.d.ts',
      });
    });

    it('should return widget contract from the secondary location if the first is not present ', async () => {
      jest
        .mocked(fetchWithTimeout)
        .mockResolvedValueOnce({
          status: 404,
          url: 'https://cdn.com/contract.rolledUp.d.ts',
          text: () => 'response1',
        } as unknown as globalThis.Response)
        .mockResolvedValue({
          status: 200,
          url: 'https://cdn.com/contracts/contract.rolledUp.d.ts',
          text: () => 'response2',
        } as unknown as globalThis.Response);

      const result = await addOrUpgradeContract(
        '@live/add',
        'integration',
        '1.0.0',
      );

      expect(buildContractFile).toHaveBeenCalledWith(
        'https://cdn.com/contracts/contract.rolledUp.d.ts',
        'response2',
      );

      expect(result[0]).toEqual({
        type: 'WidgetContractUpdated',
        widgetId: '@live/add',
        version: '1.0.0',
      });
    });

    it('should add contract ', async () => {
      jest.mocked(findLiveContractVersion).mockReturnValue('liveVersion');
      jest.mocked(fetchWithTimeout).mockResolvedValue({
        status: 200,
        text: () => 'contract',
      } as unknown as globalThis.Response);

      const result = await addOrUpgradeContract(
        '@live/add',
        'integration',
        '1.0.0',
      );

      expect(result[0]).toEqual({
        type: 'WidgetContractUpdated',
        widgetId: '@live/add',
        version: '1.0.0',
      });
    });
  });

  it('should detect when a widget is already up to date', async () => {
    jest.mocked(findLiveContractVersion).mockReturnValue('1.2.3');

    jest.mocked(FileSystem).mockImplementation(() => {
      return {
        ...jest.requireActual('../files').FileSystem,
        resolveWidgetContractPath: jest.fn(),
        buildContractFile: jest.fn(),
        readWidgetContract: jest.fn((widgetId) => {
          return {
            header: { version: '1.2.3', widgetId },
          };
        }),
      };
    });

    const result = await addOrUpgradeContract(
      '@live/add',
      'integration',
      '1.2.3',
    );

    expect(result[0]).toEqual({
      type: 'WidgetContractUpToDate',
      widgetId: '@live/add',
      version: '1.2.3',
    });
  });
});

it('should upgrade contract', async () => {
  jest.mocked(findLiveContractVersion).mockReturnValue('1.2.3');
  jest.mocked(fetchWithTimeout).mockResolvedValue({
    status: 200,
    text: () => 'contract',
  } as unknown as globalThis.Response);
  jest.mocked(FileSystem).mockImplementation(() => {
    return {
      ...jest.requireActual('../files').FileSystem,
      resolveWidgetContractPath: jest.fn(),
      buildContractFile: jest.fn(),
      readWidgetContract: jest.fn((widgetId) => {
        return {
          header: { version: '1.2.2', widgetId },
        };
      }),
    };
  });
  jest.mocked(getWidgetContractCdnUrl).mockResolvedValue({
    defaultUrl: 'https://cdn.com/contract.rolledUp.d.ts',
    defaultUrlInVariantFolder:
      'https://cdn.com/contracts/contract.rolledUp.d.ts',
    variant1: 'https://cdn.com/variant1',
  });

  const result = await addOrUpgradeContract(
    '@live/add',
    'integration',
    '1.2.3',
  );

  expect(result).toEqual([
    {
      type: 'WidgetContractUpdated',
      widgetId: '@live/add',
      version: '1.2.3',
    },
    {
      type: 'WidgetContractUpdated',
      widgetId: '@live/add/variant1',
      version: '1.2.3',
    },
  ]);
});
