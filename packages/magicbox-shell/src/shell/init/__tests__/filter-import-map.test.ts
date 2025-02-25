import { filterImportMap } from "../import-map";

describe('filterAllowedSource', () => {
  const importMap = {
    widget: 'https://docucdn-a.akamaihd.net',
    externalLib: 'https://docutest-a.akamaihd.net/baz',
  };

  it('should return the original import map if no filter is provided', () => {
    expect(filterImportMap(importMap, [])).toEqual({});
  });

  it('should exclude any mappings that do not match the specified allowedSource', () => {
    expect(
      filterImportMap(
        {
          ...importMap,
          forbidden: 'https://jsdelivr.com/someones-script',
        },
        [
          'localhost',
          '127.0.0.1',
          'docucdn-a.akamaihd.net',
          'docutest-a.akamaihd.net',
        ],
      ),
    ).toEqual(importMap);
  });
});
