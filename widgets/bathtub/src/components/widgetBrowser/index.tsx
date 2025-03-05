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
