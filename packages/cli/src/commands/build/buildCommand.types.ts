import { OptionsOf } from '../../lib/types/commanderUtils';
import { buildCommand } from './build-command';

export type BuildCommandOptions = OptionsOf<typeof buildCommand>;
