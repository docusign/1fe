import { Command } from '@commander-js/extra-typings';

export type OptionsOf<T> = T extends Command<unknown[], infer Options>
  ? Options
  : never;

export type ArgumentsOf<T> = T extends Command<infer Arguments>
  ? Arguments
  : never;
