import { outputFile } from 'fs-extra';

import { FileSystem } from '../files';
import { updateKnownWidgetsFile, getImportPath } from '../registry';
import type { ContractFileHeader, WidgetId } from '../types';
// import { HOSTED_ENVIRONMENTS } from '@1ds/helpers/isomorphic';
import { camelCase } from 'lodash';

jest.mock('fs-extra');

const expectedString = `// Warning: This file is managed by the 1ds-cli contracts command
// This is a managed dependency, and excluded from project-specific linting rules
/* eslint-disable @eslint-community/eslint-comments/no-restricted-disable */
/* eslint-disable @eslint-community/eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type { HostPropsContract as SharedFilterBarProps } from 'src/types/widgets/shared/filterBar.d.ts';
import type { HostPropsContract as TestWidgetProps } from 'src/types/widgets/test/widget/contract.d.ts';
import type { HostPropsContract as TestWidgetVariant1Props } from 'src/types/widgets/test/widget/variant1Contract.d.ts';

declare module '@1ds/shell/dist/types/types/common.d.ts' {
  interface KnownWidgets {
    '@shared/filter-bar': SharedFilterBarProps;
    '@test/widget': TestWidgetProps;
  }
  interface KnownVariants {
    '@test/widget': {
        'variant1': TestWidgetVariant1Props;
    };
  }
}`;

describe('registry', () => {
  const tests = [
    {
      input:
        '/Users/user.name/Code/package/src/types/widgets/shared/filterBar.d.ts',
      output: 'src/types/widgets/shared/filterBar.d.ts',
    },
    {
      input: '/package/src/types/widgets/shared/filterBar.d.ts',
      output: 'src/types/widgets/shared/filterBar.d.ts',
    },
    {
      input: 'src/types/widgets/shared/filterBar.ts',
      output: 'src/types/widgets/shared/filterBar.ts',
    },
  ];

  tests.forEach(({ input, output }) => {
    it(`getImportPath returns the correct import path for ${input}`, () => {
      expect(getImportPath(input)).toBe(output);
    });
  });

  describe('updateKnownWidgetsFile', () => {
    it('imports with aliases all contracts in the filesystem', async () => {
      const fileSystem = new FileSystem('/src/types');
      jest.spyOn(fileSystem, 'readWidgetContracts').mockResolvedValue([
        {
          path: 'src/types/widgets/shared/filterBar.d.ts',
          header: sampleHeader('@shared/filter-bar'),
        },
        {
          path: 'src/types/widgets/test/widget/contract.d.ts',
          header: sampleHeader('@test/widget'),
        },
        {
          path: 'src/types/widgets/test/widget/variant1Contract.d.ts',
          header: sampleHeader('@test/widget', 'variant1'),
        },
      ]);

      await updateKnownWidgetsFile(fileSystem);

      expect(outputFile).toHaveBeenCalledWith(
        expect.stringMatching('/widgets/index.d.ts$'),
        expectedString,
        { encoding: 'utf-8', flag: 'w' },
      );
    });
  });
});

function sampleHeader(
  widgetId: WidgetId,
  variantId?: string,
): ContractFileHeader {
  const fileName = camelCase(`${variantId ?? ''}Contract`);
  return {
    url: `https://docutest-a.akamaihd.net/integration/1ds/widgets/${widgetId}/1.0.62/types/${fileName}.rolledUp.d.ts`,
    environment: 'integration',
    widgetId,
    version: '1.0.62',
    variantId: variantId || '',
  };
}
