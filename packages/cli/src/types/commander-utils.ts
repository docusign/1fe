import { Command } from '@commander-js/extra-typings';

export type OptionsOf<T extends Command> = T extends Command<
  unknown[],
  infer Options
>
  ? Options
  : never;
