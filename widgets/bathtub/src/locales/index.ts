// /**
//  * WARNING: AUTO-GENERATED FILE
//  *
//  * DO NOT MODIFY THIS FILE MANUALLY.
//  * Any changes made here may be overwritten without notice.
//  * Instead, modify the source templates or configuration used by the code generation.
//  * Please add this file to your .gitignore to avoid unintentional changes being committed.
//  */

// import { TranslationsWarehouse, type TranslationDictionary } from '@ds/base';
// import { useWarehouseTranslate } from '@ds/react-utils';

// import {
//   createTranslateFunction,
//   importLocale,
//   importLocaleAsync,
//   normalizeLocale,
// } from './helpers';
// import devStrings from './locale.json';

// import type { TranslateFn } from './locale';

// const DEV_STRINGS = importLocale(devStrings);

// const LOCALE_MAP = {
//   'en-PS': () => importLocaleAsync(import('./en-PS.json')),
// } as const;

// type AvailableLocales = keyof typeof LOCALE_MAP;

// async function getLocale(locale: string): Promise<TranslationDictionary> {
//   try {
//     const normalizedLocale = normalizeLocale(locale) as AvailableLocales;
//     const downloadLocale = LOCALE_MAP[
//       normalizedLocale
//     ] as () => Promise<TranslationDictionary>;
//     const localeDictionary = await downloadLocale();
//     return localeDictionary;
//   } catch (error) {
//     platformProps.utils.logger.error({
//       message: `Requested locale:${locale} was not found. Falling back to default locale.`,
//       context: '1fe-localization:getLocale',
//       error,
//     });
//     throw error;
//   }
// }

// export const WAREHOUSE = new TranslationsWarehouse<string>(
//   getLocale,
//   DEV_STRINGS,
//   {
//     createTranslateFunction,
//     logError: (error) =>
//       platformProps.utils.logger.error({
//         message: `Missing translation`,
//         context: '1fe-localization:warehouse',
//         error,
//       }),
//   },
// );

// export const useTranslate = (
//   localeOverride: AvailableLocales | undefined = undefined,
// ): TranslateFn => {
//   return useWarehouseTranslate<string>(
//     WAREHOUSE as never,
//     localeOverride,
//   ) as TranslateFn;
// };

const translations = {
  Bathtub: {
    Header: {
      SkipLink: {
        translation: 'Skip to main',
        instruction: 'Link to the main content of the page',
      },
      Waffle: {
        translation: 'Widget switcher',
        instruction: 'Button to switch between widgets',
      },
      Docs: {
        translation: '1FE Docs',
        instruction: 'Button to link to the 1FE Docs',
      },
      Help: {
        translation: 'Help',
        instruction: 'Button to open the help slack channel',
      },
      Reset: {
        translation: 'Reset',
        instruction: 'Button to reset the widget',
      },
      Render: {
        translation: 'Render',
        instruction: 'Button to render the widget',
      },
      Editor: {
        translation: 'Widget props',
        instruction: 'Button to open the widget props',
      },
      Variant: {
        translation: 'Variant',
        instruction: 'Button to open the variant switcher',
      },
      VariantDefault: {
        translation: 'Default',
        instruction: 'Button to switch to the default widget',
      },
    },
    App: {
      Loading: {
        translation: 'Loading...',
        instruction: 'Loading message when the environment is loading',
      },
    },
    PropEditor: {
      Title: {
        translation: 'Widget props',
        instruction: 'Title of the property editor',
      },
      Update: {
        translation: 'Update',
        instruction: 'Button to update the widget props',
      },
      ValidationError: {
        translation:
          'There is a problem with props. Check the console for more information.',
        instruction: 'Error message to users when props object is not valid.',
      },
    },
    Renderer: {
      Help: {
        translation:
          'Select a <code>widget</code> from the waffle menu to get started. Or you can add the <code>widgetUrl</code> query parameter to the URL to load a specific widget.',
        instruction: 'Help message when no widget is selected',
      },
      HelpAction: {
        translation: 'Select a widget',
        instruction: 'Title of the help message',
      },
      HelpHeader: {
        translation: 'Welcome to 1FE Bathtub!',
        instruction: 'Header of the help message',
      },
      HelpFailed: {
        translation:
          'We tried loading the widget and failed. Press the CLEAN button to reset the bathtub.',
        instruction: 'Message when the widget fails to load',
      },
      HelpFailedHeader: {
        translation: "Yikes! We couldn't load the widget.",
        instruction: 'Message when the widget fails to load',
      },
      HelpFailedAction: {
        translation: 'Clean',
        instruction: 'Button to clean the bathtub',
      },
      HelpFailureLocation: {
        translation: '{{WIDGET}}:{{LOCATION}}',
        instruction: 'The error message and location joined with :',
      },
      HelpFailureOpenFile: {
        translation: 'Open in browser',
        instruction: 'Button to open the file where the error occurred',
      },
      HelpFailureStackTrace: {
        translation: 'Stack trace',
        instruction: 'Heading for the stack trace',
      },
    },
    Switcher: {
      SearchLabel: {
        translation: 'Select a widget',
        instruction: 'Label for the search input',
      },
      SearchPlaceholder: {
        translation: '@1fe/widget-starter-kit',
        instruction: 'Placeholder for the search input',
      },
      SwitcherTitle: {
        translation: 'Widget switcher',
        instruction: 'Title of the widget switcher',
      },
      UrlSwitcherLabel: {
        translation: 'Enter a widget url',
        instruction: 'Label of the widget switcher',
      },
      QuickLinksLabel: {
        translation: 'Quick load:',
        instruction: 'Label of the quick links',
      },
      Apply: {
        translation: 'Apply',
        instruction: 'Button to apply new url from the widget switcher',
      },
      SwitcherPlaceholder: {
        translation: 'http://localhost:8081/js/1fe-bundle.js',
        instruction: 'Placeholder of the widget switcher',
      },
      OrLabel: {
        translation: 'OR',
        instruction:
          'Text that separates the widget switcher and the widget url switcher',
      },
    },
    Shortcuts: {
      Title: {
        translation: 'Shortcuts',
        instruction: 'Title of the shortcuts widget',
      },
      Copy: {
        translation: 'Copy',
        instruction: 'Button to copy the shortcut',
      },
      CopyShortcut: {
        translation: 'CTRL+SHIFT+C',
        instruction: 'Shortcut to trigger the copy action',
      },
      OpenSwitcher: {
        translation: 'Open widget switcher',
        instruction: 'Button to open the widget switcher',
      },
      OpenSwitcherShortcut: {
        translation: 'Ctrl+/',
        instruction: 'Shortcut to trigger the widget switcher',
      },
      OpenEditor: {
        translation: 'Open props editor',
        instruction: 'Button to open the widget props',
      },
      OpenEditorShortcut: {
        translation: 'Ctrl+P',
        instruction: 'Shortcut to trigger the widget props',
      },
      Reset: {
        translation: 'Reset',
        instruction: 'Button to reset the widget',
      },
      ResetShortcut: {
        translation: 'Ctrl+R',
        instruction: 'Shortcut to reload the widget',
      },
      Clean: {
        translation: 'Clean (on error)',
        instruction: 'Button to clean the bathtub',
      },
      CleanShortcut: {
        translation: 'CMD+ESC',
        instruction: 'Shortcut to clean the bathtub',
      },
    },
  },
  PluginBrowser: {
    ColumnHeaders: {
      Name: {
        translation: 'Plugin',
        instruction: 'Column header for the plugin name',
      },
      VersionInt: {
        translation: 'Version: Int',
        instruction:
          'Column header for the plugin version in the integration environment',
      },
      VersionStage: {
        translation: 'Version: Stage',
        instruction:
          'Column header for the plugin version in the staging environment',
      },
      VersionDemo: {
        translation: 'Version: Demo',
        instruction:
          'Column header for the plugin version in the demo environment',
      },
      VersionProd: {
        translation: 'Version: Prod',
        instruction:
          'Column header for the plugin version in the production environment',
      },
      Route: {
        translation: 'Route',
        instruction: 'Column header for the plugin route',
      },
      Auth: {
        translation: 'Authentication Enabled',
        instruction: 'Column header for the plugin authentication required',
      },
      Launch: {
        translation: 'Launch',
        instruction: 'Column header for the plugin open button',
      },
    },
  },
  WidgetBrowser: {
    Root: {
      Title: {
        translation: 'Widget Browser',
        instruction: 'Title of the widget browser',
      },
      PreviewTag: {
        translation: 'Preview',
        instruction: 'Tag for the preview button',
      },
    },
    Menu: {
      Actions: {
        translation: 'More Actions - {{widget_name}}',
        instruction: 'Button to open the actions menu for a widget',
      },
      PipelineHeader: {
        translation: 'Pipelines',
        instruction: 'Header for the pipeline menu',
      },
      AzureDevOps: {
        translation: 'ADO Project',
        instruction: 'Button to open the ADO project',
      },
      BundleAnalysis: {
        translation: 'Bundle Analysis',
        instruction: 'Button to open the bundle analysis',
      },
      Pipeline: {
        translation: 'Pipeline',
        instruction: 'Button to open the pipeline',
      },
      Rollback: {
        translation: 'Rollback',
        instruction: 'Button to rollback the widget',
      },
      ConfigurationHeader: {
        translation: 'Configs',
        instruction: 'Header for the configuration menu',
      },
      ConfigurationInt: {
        translation: 'Integration',
        instruction: 'Button to open the widget integration configuration',
      },
      ConfigurationStage: {
        translation: 'Stage',
        instruction: 'Button to open the widget stage configuration',
      },
      ConfigurationDemo: {
        translation: 'Demo',
        instruction: 'Button to open the widget demo configuration',
      },
      ConfigurationProd: {
        translation: 'Production',
        instruction: 'Button to open the widget prod configuration',
      },
      Team: {
        translation: 'Contact',
        instruction: 'Button to contact the widget owner',
      },
      CreatedDate: {
        translation: 'Created {{date}}',
        instruction: 'Description of the widget creation date',
      },
    },
    Links: {
      Repository: {
        translation: 'Repository - {{widget_name}}',
        instruction: 'Link to the widget repository',
      },
      Configuration: {
        translation: 'Configuration',
        instruction: 'Link to the widget configuration',
      },
      Bathtub: {
        translation: 'Launch {{widget_name}}',
        instruction: 'Link to the widget in the bathtub',
      },
      Version: {
        translation: '{{version_number}} - {{widget_name}}',
        instruction:
          'Link showing the version number with the widget name added for additional context',
      },
    },
    Columns: {
      Id: {
        translation: 'Id',
        instruction: 'Column header for Id',
      },
      Name: {
        translation: 'NAME',
        instruction: 'Column header for Name',
      },
      Links: {
        translation: 'LINKS',
        instruction: 'Column header for Links',
      },
      Route: {
        translation: 'ROUTE',
        instruction: 'Column header for Route',
      },
      Authentication: {
        translation: 'AUTHENTICATION',
        instruction: 'Column header for Authentication',
      },
      Integration: {
        translation: 'INTEGRATION',
        instruction: 'Column header for Integration',
      },
      Stage: {
        translation: 'STAGE',
        instruction: 'Column header for Stage',
      },
      Demo: {
        translation: 'DEMO',
        instruction: 'Column header for Demo',
      },
      Prod: {
        translation: 'PROD',
        instruction: 'Column header for Prod',
      },
      Action: {
        translation: 'ACTION',
        instruction: 'Column header for Action',
      },
    },
  },
  DataTable: {
    Footer: {
      AccessibilityText: {
        translation: 'Pagination',
        instruction: 'Accessibility text for the pagination',
      },
    },
  },
};

// criminal
export const useTranslate = () => {
  return (
    key: `${string}.${string}.${string}`,
    options?: Record<string, string>,
  ): string => {
    const resource = key
      .split('.')
      .reduce((o, k) => (o as any)?.[k], translations);
    return (resource as any).translation;
  };
};
