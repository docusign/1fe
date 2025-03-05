// import styled from '@emotion/styled';

// import { Center } from 'src/components/layout';
// import { useTranslate } from 'src/locales';
// import { Widget } from 'src/services/widget';
// import { useAppDispatch } from 'src/store';
// import { appActions } from 'src/store/app';

// type WidgetLinksProps = {
//   widget: Widget;
// };

// const ImageWrapper = styled(Center)`
//   width: 24px;
//   height: 24px;

//   img {
//     height: 100%;
//   }
// `;

// export const NameLink: React.FC<WidgetLinksProps> = ({ widget }) => {
//   const dispatch = useAppDispatch();
//   const t = useTranslate();

//   return (
//     <a
//       //   accessibilityText={t('WidgetBrowser.Links.Bathtub', {
//       //     widget_name: widget.widgetId,
//       //   })}
//       onClick={() => {
//         if (widget.isPlugin) {
//           window.open(widget.route, '_blank');
//           return;
//         }

//         dispatch(
//           appActions.setActiveWidgetUrl(
//             widget.lastModified.integration?.bundleUrl ?? '',
//           ),
//         );
//       }}
//     >
//       {widget.widgetId}
//     </a>
//   );
// };

// // export const WidgetLinks: React.FC<WidgetLinksProps> = ({ widget }) => {
// //   const t = useTranslate();

// //   return (
// //     <Row gap={'16px'} align='center'>
// //       <Button
// //         title={t('WidgetBrowser.Links.Repository', {
// //           widget_name: widget.widgetId,
// //         })}
// //         accessibilityText={t('WidgetBrowser.Links.Repository', {
// //           widget_name: widget.widgetId,
// //         })}
// //         startElement={
// //           <ImageWrapper width='24px' height='24px'>
// //             <Image
// //               width={24}
// //               src={GithubLogo}
// //               alt={t('WidgetBrowser.Links.Repository')}
// //             />
// //           </ImageWrapper>
// //         }
// //         href={widget.repoUrl}
// //         target='_blank'
// //       />

// //       <Button
// //         title={t('WidgetBrowser.Menu.AzureDevOps')}
// //         accessibilityText={t('WidgetBrowser.Menu.AzureDevOps')}
// //         startElement={
// //           <ImageWrapper width='24px' height='24px'>
// //             <Image
// //               width={24}
// //               src={AdoLogo}
// //               alt={t('WidgetBrowser.Menu.AzureDevOps')}
// //             />
// //           </ImageWrapper>
// //         }
// //         href={widget.adoProjectUrl}
// //         target='_blank'
// //       />
// //     </Row>
// //   );
// // };
