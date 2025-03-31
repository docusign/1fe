import { displayContractErrors } from '../console';

const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

const missingContracts = [
  'Widget @1ds/error2 not found in published versions (integration)',
  'Widget @fake/widget not found in published versions (integration)',
];

const tsError = `
src/index.ts:5:10 - error TS2322: Type 'number' is not assignable to type 'string'.

src/app.ts:12:15 - error TS7006: Parameter 'msg' implicitly has an 'any' type.

src/utils.ts:20:5 - error TS2554: Expected 2 arguments, but got 1.

Found 3 errors in 3 files.
`;

describe('console', () => {
  it('If there are only TS errors, should skip missing contract section', () => {
    displayContractErrors([], tsError);
    expect(logSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Missing Contracts'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('TypeScript Errors'),
    );
  });

  it('If there are only missing contract errors, should skip TS errors section', () => {
    displayContractErrors(missingContracts, '');
    expect(logSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('TypeScript Errors'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing Contracts'),
    );
  });

  it('Should print both error sections if both exist', () => {
    displayContractErrors(missingContracts, tsError);
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('TypeScript Errors'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing Contracts'),
    );
  });
});
