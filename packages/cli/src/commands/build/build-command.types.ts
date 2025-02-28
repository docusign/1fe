import { OptionsOf } from '../../types/commander-utils';
import { buildCommand } from './build-command';

export type BuildCommandOptions = OptionsOf<typeof buildCommand>;
