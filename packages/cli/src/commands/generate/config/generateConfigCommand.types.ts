import { OptionsOf } from 'src/lib/types/commanderUtils';
import { generateConfigCommand } from './generateConfigCommand';

export type GenerateCommandOptions = OptionsOf<typeof generateConfigCommand>;
