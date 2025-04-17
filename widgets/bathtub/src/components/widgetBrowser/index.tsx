// import styled from '@emotion/styled';
// import { memo } from 'react';

// import { Box } from 'src/components/layout';
// import { useAppSelector } from 'src/store';
// import { widgetBrowserSelectors } from 'src/store/widgetBrowser';

// // from @ds/tokens
// const xxs = '8px';
// const xs = '16px';

// const Layout = styled(Box)`
//   display: grid;
//   grid-template-rows: auto 1fr;
//   grid-template-columns: 100%;
//   grid-template-areas: 'filter' 'table';
//   height: 100%;
//   width: 100%;
//   padding: ${xxs} 0 ${xs} ${xxs};
// `;

// const Area = styled(Box)`
//   grid-area: ${({ area }: { area: 'filter' | 'table' }) => area};
//   overflow: auto;
//   height: 100%;
//   width: 100%;
// `;

// const WidgetBrowser = memo(() => {
//   const widgets = useAppSelector(widgetBrowserSelectors.selectFilteredWidgets);

//   // const DataTable: React.FC<SharedDataTableProps<Widget>> =
//   //   platformProps.utils.widgets.get('@shared/data-table');

//   return (
//     <Layout>
//       {/* <Area area='filter'>
//         <WidgetFilter />
//       </Area> */}
//       <Area area='table'>
//         <table>
//           <thead>
//             <tr>
//               <th>Widget ID</th>
//               <th>Route</th>
//               <th>Version</th>
//             </tr>
//           </thead>
//           <tbody>
//             {widgets.map((widget) => (
//               <tr key={widget.widgetId}>
//                 <td>{widget.widgetId}</td>
//                 <td>{widget.route ? widget.route : ''}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </Area>
//     </Layout>
//   );
// });

// export { WidgetBrowser };

import { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import { useAppSelector } from '../../store';
import { widgetBrowserSelectors } from '../../store/widgetBrowser';

export function WidgetBrowser() {
  const widgets = useAppSelector(widgetBrowserSelectors.selectFilteredWidgets);

  const columns = [
    {
      title: 'Widget ID',
      dataIndex: 'widgetId',
      key: 'widgetId',
    },
    {
      title: 'Route',
      dataIndex: ['plugin', 'route'],
      key: 'route',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Has Auth',
      dataIndex: ['plugin', 'auth'],
      key: 'auth',
      render: (auth) => (auth ? 'true' : 'false'),
    },
  ];

  return (
    <div>
      <Typography.Title level={2}>Widget Browser</Typography.Title>
      <Table
        dataSource={widgets}
        columns={columns}
        rowKey='widgetId'
        locale={{ emptyText: 'No widget configuration found.' }}
      />
    </div>
  );
}
