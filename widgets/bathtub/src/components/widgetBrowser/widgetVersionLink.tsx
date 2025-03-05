// import { useTranslate } from 'src/locales';
// import { Widget } from 'src/services/widget';

// export type WidgetVersionLinkProps = {
//   widget: Widget;
//   readonly env: 'integration' | 'stage' | 'demo' | 'production';
// };

// export const WidgetVersionLink = ({
//   widget,
//   env = 'integration',
// }: WidgetVersionLinkProps) => {
//   const t = useTranslate();

//   if (!widget.lastModified[env]?.widgetVersion) {
//     return null;
//   }

//   return (
//     <a
//       // discrete
//       // kind='subtle'
//       // accessibilityText={t('WidgetBrowser.Links.Version', {
//       //   widget_name: widget.widgetId,
//       //   version_number: widget.lastModified[env].widgetVersion,
//       // })}
//       href={widget.lastModified[env].bundleUrl}
//       target='_blank'
//     >
//       {widget.lastModified[env].widgetVersion}
//     </a>
//   );
// };
