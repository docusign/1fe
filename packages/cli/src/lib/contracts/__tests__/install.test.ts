// TODO: Re-enable CLI unit tests @sushruth
test('temp placeholder', () => {});

// import { mockLiveVersions } from '../../__tests__/test-utils/mockLiveVersions';
// import { FileSystem } from '../files';
// import { getCurrentWidgetContracts } from '../install';

// jest.mock('../files');
// jest.mock('../versions', () => ({
//   findLiveContractVersion: jest.fn().mockReturnValue('1.0.131'),
// }));

// jest.mock('../../validations/one-ds-config/one-ds-config', () => ({
//   getAndValidateOneDSConfigTs: jest.fn().mockResolvedValue({
//     'schema-version': '1.0.0',
//     runtime: {
//       integration: {
//         dependsOn: {
//           pinnedWidgets: [
//             { widgetId: '@pinned/update', version: '1.0.131' },
//             { widgetId: '@pinned/add', version: '1.0.131' },
//           ],
//           widgets: [{ widgetId: '@live/update' }, { widgetId: '@live/add' }],
//         },
//       },
//     },
//   }),
// }));

// describe('Install', () => {
//   it('should install contracts', async () => {
//     jest.mocked(FileSystem).mockImplementation(() => {
//       return {
//         ...jest.requireActual('../files').FileSystem,
//         ensureWidgetContractsFiles: jest.fn(),
//         readWidgetContracts: jest.fn().mockResolvedValue([
//           {
//             header: { version: '1.0.0', widgetId: '@pinned/remove' },
//           },
//           {
//             header: { version: '1.0.0', widgetId: '@pinned/update' },
//           },
//           { header: { version: '1.0.2', widgetId: '@live/remove' } },
//           {
//             header: {
//               version: '1.0.2',
//               widgetId: '@live/update',
//               variantId: '',
//             },
//           },
//           {
//             header: {
//               version: '1.0.2',
//               widgetId: '@live/update',
//               variantId: 'testId',
//             },
//           },
//         ]),
//       };
//     });
//     const result = await getCurrentWidgetContracts(mockLiveVersions);

//     expect(result).toEqual([
//       {
//         widgetId: '@pinned/remove',
//         availableVersion: null,
//       },
//       {
//         availableVersion: '1.0.131',
//         installedVersion: '1.0.0',
//         widgetId: '@pinned/update',
//       },
//       { widgetId: '@live/remove', availableVersion: null },
//       {
//         availableVersion: '1.0.131',
//         installedVersion: '1.0.2',
//         widgetId: '@live/update',
//       },
//       {
//         availableVersion: '1.0.131',
//         widgetId: '@live/add',
//       },
//       {
//         availableVersion: '1.0.131',
//         widgetId: '@pinned/add',
//       },
//     ]);
//   });
// });
