import { Command, Option } from '@commander-js/extra-typings';

type AddCommandsToProgramArgs = {
  program: Command;
  commands: (
    | Command
    | {
        command: string;
        description: string;
        action: (...args: unknown[]) => void | Promise<void>;
        optionsToAction: Option[];
      }
    | Record<never, never>
  )[];
};

export const addCommandsToProgram = async ({
  program,
  commands,
}: AddCommandsToProgramArgs) => {
  commands.forEach((c) => {
    if (c instanceof Command) {
      program.addCommand(c, {});
    } else if ('command' in c) {
      const command = program
        .command(c.command)
        .description(c.description)
        .action(c.action);

      for (const option of c.optionsToAction) {
        if (option) {
          command.addOption(option);
        }
      }
    }
  });
};
