/**
 * A jest test to ensure the getPlugin function returns the correct plugin
 * and returns null if there is no plugin mounted in the shell
 * Mock the getTree function to return a tree with a plugin mounted
 */

import { getPlugin } from '..';

jest.mock('../../getTree', () => ({
  getTree: jest.fn(() => [
    {
      id: '1FE_SHELL',
      data: {},
      children: [
        {
          id: 'test-plugin',
          data: {},
        },
      ],
    },
  ]),
}));

describe('getPlugin', () => {
  it('should return the correct plugin', () => {
    const plugin = getPlugin();
    expect(plugin).toHaveProperty('id', 'test-plugin');
  });

  it('should return null if there is no plugin mounted', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    jest.spyOn(require('../../getTree'), 'getTree').mockReturnValueOnce([
      {
        id: '1FE_SHELL',
        data: {},
        children: [],
      },
    ]);
    const plugin = getPlugin();
    expect(plugin).toBeNull();
  });
});
