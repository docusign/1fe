import { getLogger } from '../../getLogger';
// import { getCliTraceConsoleLogger } from '../../cliTraceConsoleLogger';
import { fetchWithTimeout } from '../../network/network';
import { variantsPathSuffix } from '../constants';
import { getWidgetCdnVariants } from '../variants';

jest.mock('../../getLogger', () => ({
  getLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));
jest.mock('../../network', () => ({
  fetchWithTimeout: jest.fn(),
}));
const baseUrl = 'https://example.com';
const widgetId = '@widget/id';

describe('variants', () => {
  it('should return an array as json when given a proper baseurl', async () => {
    (fetchWithTimeout as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(['testVariant', 'testVariant2']),
    });
    const result = await getWidgetCdnVariants(baseUrl, widgetId);

    expect(fetchWithTimeout).toHaveBeenCalledWith(
      `${baseUrl}${variantsPathSuffix}`,
    );
    expect(result).toEqual(['testVariant', 'testVariant2']);
  });

  it('should trace log an error and return an empty array when fetch fails', async () => {
    (fetchWithTimeout as jest.Mock).mockResolvedValue({
      ok: false,
    });
    const result = await getWidgetCdnVariants(baseUrl, widgetId);
    expect(result).toEqual([]);
    expect(jest.mocked(getLogger('[]').error)).toHaveBeenCalledWith(
      `[CONTRACT] Unable to fetch variants from https://example.com/types/contracts/variants.json`,
    );
  });
});
