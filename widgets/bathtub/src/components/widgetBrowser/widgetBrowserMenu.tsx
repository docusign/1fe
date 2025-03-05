// import { OverflowVertical } from '@ds/icons';
// import { Button, Menu } from '@ds/ui';
// import { memo } from 'react';

// import { Visible } from 'src/components/layout';
// import { useTranslate } from 'src/locales';
// import { Widget } from 'src/services/widget';

// type WidgetBrowserMenuProps = {
//   widget: Widget;
// };

// const WidgetBrowserMenu: React.FC<WidgetBrowserMenuProps> = memo(
//   ({ widget }) => {
//     const t = useTranslate();

//     return (
//       <Menu.Button>
//         {({
//           buttonOnClick,
//           buttonOnKeyDown,
//           buttonRef,
//           menuVisible,
//           menuAnchor,
//           menuRef,
//           menuItemOnKeyDown,
//           menuOnVisible,
//         }): JSX.Element => (
//           <>
//             <Button
//               data-delegate='ignore'
//               data-qa='documentsGridMenuButton'
//               onClick={buttonOnClick}
//               onKeyDown={buttonOnKeyDown}
//               kind='tertiary'
//               forwardedRef={buttonRef}
//               startElement={<OverflowVertical />}
//               accessibilityText={t('WidgetBrowser.Menu.Actions', {
//                 widget_name: widget.widgetId,
//               })}
//             />
//             <Menu
//               data-delegate='ignore'
//               data-qa='documentsGridMenu'
//               visible={menuVisible}
//               anchor={menuAnchor}
//               forwardedRef={menuRef}
//               onVisible={menuOnVisible}
//             >
//               <Menu.Group
//                 title={t('WidgetBrowser.Menu.Pipeline')}
//                 accessibilityTitle={t('WidgetBrowser.Menu.Pipeline')}
//               >
//                 <Visible
//                   if={widget}
//                   then={
//                     <Menu.Item
//                       text={t('WidgetBrowser.Menu.AzureDevOps')}
//                       href={widget.adoProjectUrl}
//                       target='_blank'
//                       onKeyDown={menuItemOnKeyDown}
//                     />
//                   }
//                 />
//                 <Visible
//                   if={widget.lastModified.integration?.pipelineUrl}
//                   then={
//                     <Menu.Item
//                       text={t('WidgetBrowser.Menu.Pipeline')}
//                       href={widget.lastModified.integration?.pipelineUrl}
//                       onKeyDown={menuItemOnKeyDown}
//                       target='_blank'
//                     />
//                   }
//                 />
//               </Menu.Group>
//               <Menu.Group
//                 title={t('WidgetBrowser.Menu.ConfigurationHeader')}
//                 accessibilityTitle={t('WidgetBrowser.Menu.ConfigurationHeader')}
//               >
//                 <Visible
//                   if={widget.lastModified.integration?.configUrl}
//                   then={
//                     <Menu.Item
//                       text={t('WidgetBrowser.Menu.ConfigurationInt')}
//                       href={widget.lastModified.integration?.configUrl}
//                       onKeyDown={menuItemOnKeyDown}
//                       target='_blank'
//                     />
//                   }
//                 />
//                 <Visible
//                   if={widget.lastModified.stage?.configUrl}
//                   then={
//                     <Menu.Item
//                       text={t('WidgetBrowser.Menu.ConfigurationStage')}
//                       href={widget.lastModified.stage?.configUrl}
//                       onKeyDown={menuItemOnKeyDown}
//                       target='_blank'
//                     />
//                   }
//                 />
//                 <Visible
//                   if={widget.lastModified.demo?.configUrl}
//                   then={
//                     <Menu.Item
//                       text={t('WidgetBrowser.Menu.ConfigurationDemo')}
//                       href={widget.lastModified.demo?.configUrl}
//                       onKeyDown={menuItemOnKeyDown}
//                       target='_blank'
//                     />
//                   }
//                 />
//                 <Visible
//                   if={widget.lastModified.production?.configUrl}
//                   then={
//                     <Menu.Item
//                       text={t('WidgetBrowser.Menu.ConfigurationProd')}
//                       href={widget.lastModified.production?.configUrl}
//                       onKeyDown={menuItemOnKeyDown}
//                       target='_blank'
//                     />
//                   }
//                 />
//               </Menu.Group>
//               <Menu.Group accessibilityTitle='Contact'>
//                 <Menu.Item
//                   text={t('WidgetBrowser.Links.Repository', {
//                     widget_name: widget.widgetId,
//                   })}
//                   href={widget.repoUrl}
//                   onKeyDown={menuItemOnKeyDown}
//                   target='_blank'
//                 />
//               </Menu.Group>
//             </Menu>
//           </>
//         )}
//       </Menu.Button>
//     );
//   },
// );

// export { WidgetBrowserMenu };
