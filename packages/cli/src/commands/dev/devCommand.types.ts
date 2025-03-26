import { OptionsOf } from 'src/lib/types/commanderUtils';
import { devCommand } from './devCommand';

export type DevCommandOptions = OptionsOf<typeof devCommand>;
