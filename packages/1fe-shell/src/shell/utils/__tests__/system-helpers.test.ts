import { PlatformPropsType } from '../../types/platform-utils';
import { addScopedImportMapForPlatformProps } from '../system-helpers';

describe('addScopedImportMapForPlatformProps', () => {
  it('should call System.set with correct information', () => {
    const orignalSystem = System;
    const mockSystem = {
      set: jest.fn(),
    } as unknown as typeof System;

    (System as any) = mockSystem;
    addScopedImportMapForPlatformProps('@ds/foo', {} as PlatformPropsType);
    expect(System.set).toHaveBeenCalledWith('app:@1fe/shell::@ds/foo', {
      __esModule: true,
      platformProps: {},
    });
    (System as any) = orignalSystem;
  });
});
