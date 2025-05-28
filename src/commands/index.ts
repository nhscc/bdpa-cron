import { checkArrayNotEmpty, CommandNotImplementedError } from '@-xun/cli';
import { scriptBasename } from '@-xun/cli/util';

import { configFile, globalCliName } from 'universe:constant.ts';
import { withGlobalBuilder, withGlobalUsage } from 'universe:util.ts';

import type { AsStrictExecutionContext, RootConfiguration } from '@-xun/cli';
import type { GlobalCliArguments, GlobalExecutionContext } from 'universe:configure.ts';

export enum Task {
  InitializeData = 'initialize',
  BanHammer = 'ban',
  PruneData = 'prune',
  SimulateActivity = 'simulate',
  All = 'all'
}

/**
 * @see {@link Task}
 */
export const tasks = Object.values(Task);

export type CustomCliArguments = GlobalCliArguments & {
  tasks: Task[];
};

export default function command({
  standardDebug
}: AsStrictExecutionContext<GlobalExecutionContext>): RootConfiguration<
  CustomCliArguments,
  GlobalExecutionContext
> {
  const allActualTasks = tasks.filter((task) => task !== Task.All);

  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>(
    {
      tasks: {
        alias: 'task',
        array: true,
        choices: tasks,
        default: allActualTasks,
        defaultDescription: Task.All,
        check: checkArrayNotEmpty('--tasks'),
        coerce(tasks: Task | Task[]) {
          return Array.from(
            new Set(
              [tasks].flat().flatMap((task) => {
                switch (task) {
                  case Task.All: {
                    return allActualTasks;
                  }

                  default: {
                    return task;
                  }
                }
              })
            )
          );
        }
      }
    },
    { additionalCommonOptions: ['version'] }
  );

  return {
    name: globalCliName,
    builder,
    description: "A CLI tool for keeping HSCC's Mongo Atlas clusters alive and healthy",
    usage: withGlobalUsage(
      `$1.

Configuration file location: ${configFile}
`,
      { includeSubCommand: true, appendPeriod: false }
    ),
    handler: withGlobalHandler(function ({
      $0: scriptFullName,
      hush: isHushed,
      quiet: isQuieted,
      silent: isSilenced,
      targets,
      tasks
    }) {
      const debug = standardDebug.extend(`handler-${scriptBasename(scriptFullName)}`);

      debug('entered handler');

      debug('tasks: %O', tasks);
      debug('targets: %O', targets);
      debug('isHushed: %O', isHushed);
      debug('isQuieted: %O', isQuieted);
      debug('isSilenced: %O', isSilenced);

      throw new CommandNotImplementedError();
    })
  };
}
