import { Command, Option } from '@commander-js/extra-typings';
import { contractsInstallAction } from './contractsInstallAction';
// import { WidgetId } from 'src/lib/contracts';

export const contractsInstallCommand = new Command('install')
  .addOption(
    new Option(
      '--widgetIds <widgetIds...>',
      'A list of widgets to specifically install contracts of.',
    ),
  )
  .option('--outdated', 'Check for outdated contracts', false)
  .description(
    `Install widget contract versions specified in .1ds.config's dependsOn array`,
  )
  .action(contractsInstallAction);
