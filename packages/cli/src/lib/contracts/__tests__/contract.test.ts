import { buildContractFile, parseHeader } from '../contract';

describe('contract', () => {
  const sampleContract = 'export type HostContractProps = {};';

  describe('buildContractFile', () => {
    it('adds eslint disable comments to the header', () => {
      const withHeader = buildContractFile(
        'https://akamamaihd.net/foo',
        sampleContract,
      );
      expect(withHeader).toContain(
        '/* eslint-disable @eslint-community/eslint-comments/no-restricted-disable */',
      );
      expect(withHeader).toContain(
        '/* eslint-disable @eslint-community/eslint-comments/no-unlimited-disable */',
      );
      expect(withHeader).toContain('/* eslint-disable */');
    });
  });

  describe('parseHeader', () => {
    it.each([
      [
        'https://docutest-a.akamaihd.net/integration/1ds/widgets/@shared/filter-bar/1.0.62/types/contract.rolledUp.d.ts',
        {
          environment: 'integration',
          widgetId: '@shared/filter-bar',
          version: '1.0.62',
          variantId: '',
        },
      ],
      [
        'https://docutest-b.akamaihd.net/production/1ds/widgets/@ds/send/1.0.62-2/types/contract.rolledUp.d.ts',
        {
          environment: 'production',
          widgetId: '@ds/send',
          version: '1.0.62-2',
          variantId: '',
        },
      ],
      [
        'https://docutest-b.akamaihd.net/production/1ds/widgets/@ds/send/1.0.62-2/types/variant1Contract.rolledUp.d.ts',
        {
          environment: 'production',
          widgetId: '@ds/send',
          version: '1.0.62-2',
          variantId: 'variant1',
        },
      ],
    ])(
      'creates parseable headers with the given cdn URLs',
      (sampleUrl, contractFileHeader) => {
        const withHeader = buildContractFile(sampleUrl, sampleContract);
        const header = parseHeader(withHeader);

        expect(header).toEqual({
          url: sampleUrl,
          ...contractFileHeader,
        });
      },
    );
    it('returns undefined if header cannot be parsed', () => {
      expect(parseHeader('')).toBeUndefined();
      expect(parseHeader('foo')).toBeUndefined();
      expect(parseHeader('* source: https://foo.com')).toBeUndefined();
    });
  });
});
