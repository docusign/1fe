// import { NameLink } from 'src/components/widgetBrowser/widgetLinks';
// import { WidgetVersionLink } from 'src/components/widgetBrowser/widgetVersionLink';
// import { Widget } from 'src/services/widget';
// import type { HostPropsContract as SharedDataTableProps } from 'src/types/widgets/shared/dataTable';

// type ColumnDefition = SharedDataTableProps<Widget>['columns'][number];

// const parseSemanticVersion = (version: string | undefined): number => {
//   try {
//     if (!version) {
//       return -1;
//     }

//     const [main, preRelease] = version.split('-');
//     const [major, minor, patch] = main.split('.').map(Number);
//     const preReleaseNumber = preRelease ? parseInt(preRelease, 10) : 0;
//     const parsed =
//       major * 100_000_000 + minor * 100_000 + patch * 1_000 + preReleaseNumber;

//     if (isNaN(parsed)) {
//       return -1;
//     }

//     return parsed;
//   } catch {
//     return -1;
//   }
// };

// export const columns: ColumnDefition[] = [
//   {
//     alignment: 'start',
//     headerText: 'WidgetBrowser.Columns.Id',
//     isIndex: true,
//     isSortable: true,
//     isVisible: false,
//     key: 'widgetId',
//     order: 1,
//     value: 'widgetId',
//   },
//   {
//     alignment: 'start',
//     headerText: 'WidgetBrowser.Columns.Name',
//     isSortable: true,
//     key: 'widgetName',
//     order: 2,
//     value: ({ row }) => <NameLink widget={row} />,
//   },
//   // {
//   //   alignment: 'left',
//   //   headerText: 'WidgetBrowser.Columns.Links',
//   //   isSortable: false,
//   //   key: 'links',
//   //   order: 3,
//   //   value: ({ row }) => <WidgetLinks widget={row} />,
//   // },
//   {
//     alignment: 'start',
//     headerText: 'WidgetBrowser.Columns.Route',
//     isSortable: true,
//     key: 'pluginRoute',
//     order: 10,
//     value: ({ row }) => (
//       <a href={row.route} target='_blank'>
//         {row.route}
//       </a>
//     ),
//     sortValue: (row) => {
//       return row.route ?? '';
//     },
//   },
//   {
//     alignment: 'left',
//     headerText: 'WidgetBrowser.Columns.Integration',
//     isSortable: true,
//     key: 'versionInt',
//     order: 5,
//     value: ({ row }) => <WidgetVersionLink widget={row} env='integration' />,
//     sortValue: (row) => {
//       return parseSemanticVersion(row.lastModified.integration?.widgetVersion);
//     },
//   },
//   {
//     alignment: 'left',
//     headerText: 'WidgetBrowser.Columns.Stage',
//     isSortable: true,
//     key: 'versionStage',
//     order: 6,
//     value: ({ row }) => <WidgetVersionLink widget={row} env='stage' />,
//     sortValue: (row) => {
//       return parseSemanticVersion(row.lastModified.stage?.widgetVersion);
//     },
//   },
//   {
//     alignment: 'left',
//     headerText: 'WidgetBrowser.Columns.Demo',
//     isSortable: true,
//     key: 'versionDemo',
//     order: 7,
//     value: ({ row }) => <WidgetVersionLink widget={row} env='demo' />,
//     sortValue: (row) => {
//       return parseSemanticVersion(row.lastModified.demo?.widgetVersion);
//     },
//   },
//   {
//     alignment: 'left',
//     headerText: 'WidgetBrowser.Columns.Prod',
//     isSortable: true,
//     key: 'versionProd',
//     order: 8,
//     value: ({ row }) => <WidgetVersionLink widget={row} env='production' />,
//     sortValue: (row) => {
//       return parseSemanticVersion(row.lastModified.production?.widgetVersion);
//     },
//   },
//   // {
//   //   alignment: 'end',
//   //   headerText: 'WidgetBrowser.Columns.Action',
//   //   hideText: true,
//   //   isSortable: false,
//   //   key: 'action',
//   //   order: 100,
//   //   value: ({ row }): React.ReactNode => <WidgetBrowserMenu widget={row} />,
//   // },
// ];
