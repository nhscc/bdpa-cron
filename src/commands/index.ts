import { checkArrayNotEmpty, CliError } from '@-xun/cli';
import { LogTag, standardSuccessMessage } from '@-xun/cli/logging';
import { scriptBasename } from '@-xun/cli/util';
import { SHORT_TAB } from 'rejoinder';

import { getWellKnownConfigPath } from 'universe:configure.ts';

import {
  allActualTargetProblems,
  globalCliName,
  TargetDatabase,
  TargetYear
} from 'universe:constant.ts';

import { ErrorMessage } from 'universe:error.ts';
import runBanHammer from 'universe:tasks/ban-hammer.ts';
import runInitializeData from 'universe:tasks/initialize-data.ts';
import runPruneData from 'universe:tasks/prune-data.ts';
import runSimulateActivity from 'universe:tasks/simulate-activity.ts';

import {
  withGlobalBuilder,
  withGlobalUsage,
  withStandardListrTaskConfigFactory
} from 'universe:util.ts';

import type { AsStrictExecutionContext, RootConfiguration } from '@-xun/cli';
import type { GlobalCliArguments, GlobalExecutionContext } from 'universe:configure.ts';
import type { ListrTaskLiteral } from 'universe:util.ts';

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

export default async function command({
  standardDebug,
  standardLog,
  getConfig,
  taskManager
}: AsStrictExecutionContext<GlobalExecutionContext>): Promise<
  RootConfiguration<CustomCliArguments, GlobalExecutionContext>
> {
  const allActualTasks = tasks.filter((task) => task !== Task.All);

  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>(
    {
      tasks: {
        alias: 'task',
        array: true,
        demandThisOption: true,
        choices: tasks,
        description: 'One or more tasks to run against target APIs',
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

::Problem Statements + Database Servers::

${allActualTargetProblems
  .map((name) =>
    `
[${Object.entries(TargetYear)
      .filter(([, names]) => (names as readonly string[]).includes(name))
      .map(
        ([year, names]) =>
          `${year}${names.length < 2 || names[1] === name ? '-actual' : '-sample'}`
      )
      .join(', ')}] ${name} (database server: ${Object.entries(TargetDatabase)
      .filter(([, named]) => named === name)
      .map(([server]) => server)
      .join(', ')})
`.trim()
  )
  .join('\n')}

::Configuration File Location::

${SHORT_TAB}${await getWellKnownConfigPath()}
`,
      { includeSubCommand: true, appendPeriod: false }
    ),
    handler: withGlobalHandler(async function ({
      $0: scriptFullName,
      hush: isHushed,
      quiet: isQuieted,
      silent: isSilenced,
      targets,
      tasks: requestedApiTasks
    }) {
      const debug = standardDebug.extend(`handler-${scriptBasename(scriptFullName)}`);

      debug('entered handler');

      debug('requested API tasks: %O', requestedApiTasks);
      debug('targets: %O', targets);
      debug('isHushed: %O', isHushed);
      debug('isQuieted: %O', isQuieted);
      debug('isSilenced: %O', isSilenced);

      standardLog([LogTag.IF_NOT_SILENCED], 'API tasks: %O', requestedApiTasks);
      standardLog.newline([LogTag.IF_NOT_SILENCED]);

      const withStandardListrTaskConfig = withStandardListrTaskConfigFactory({
        standardLog,
        standardDebug
      });

      const reifiedApiTasks = targets.map((target) => {
        return withStandardListrTaskConfig({
          initialTitle: `API: ${target}`,
          task(taskRunnerContext) {
            const { listrTask } = taskRunnerContext;
            const subTasks: ListrTaskLiteral[] = [];

            let queued = false;

            if (requestedApiTasks.includes(Task.BanHammer)) {
              queued = true;
              subTasks.push(
                withStandardListrTaskConfig({
                  initialTitle: 'Executing task "ban hammer"...',
                  async task({ listrTask }) {
                    await runBanHammer(target, getConfig, taskRunnerContext);
                    listrTask.title = 'Finished task "ban hammer"';
                  }
                })
              );
            }

            if (requestedApiTasks.includes(Task.PruneData)) {
              queued = true;
              subTasks.push(
                withStandardListrTaskConfig({
                  initialTitle: 'Executing task "prune data"...',
                  async task({ listrTask }) {
                    await runPruneData(target, getConfig, taskRunnerContext);
                    listrTask.title = 'Finished task "prune data"';
                  }
                })
              );
            }

            if (requestedApiTasks.includes(Task.InitializeData)) {
              queued = true;
              subTasks.push(
                withStandardListrTaskConfig({
                  initialTitle: 'Executing task "initialize data" (no-op)...',
                  async task({ listrTask }) {
                    await runInitializeData(target, getConfig, taskRunnerContext);
                    listrTask.title = 'Finished task "initialize data" (no-op)';
                  }
                })
              );
            }

            if (requestedApiTasks.includes(Task.SimulateActivity)) {
              queued = true;
              subTasks.push(
                withStandardListrTaskConfig({
                  initialTitle: 'Executing task "simulate activity" (no-op)...',
                  async task({ listrTask }) {
                    await runSimulateActivity(target, getConfig, taskRunnerContext);
                    listrTask.title = 'Finished task "simulate activity" (no-op)';
                  }
                })
              );
            }

            if (!queued) {
              throw new CliError(ErrorMessage.UnimplementedTasks());
            }

            return listrTask.newListr(subTasks, { concurrent: true });
          }
        });
      });

      taskManager.add([
        withStandardListrTaskConfig({
          initialTitle: `Running applicable tasks across ${targets.length} API${targets.length === 1 ? '' : 's'}...`,
          task: function ({ listrTask: rootListrTask }) {
            return rootListrTask.newListr(
              [
                {
                  task: function (_, thisTask) {
                    return thisTask.newListr(reifiedApiTasks, { concurrent: true });
                  }
                },
                {
                  task: function () {
                    rootListrTask.title = `Ran all applicable tasks across ${targets.length} API${targets.length === 1 ? '' : 's'}`;
                  }
                }
              ],
              { concurrent: false }
            );
          }
        })
      ]);

      try {
        await taskManager.runAll();
      } finally {
        standardLog.newline([LogTag.IF_NOT_SILENCED]);
      }

      standardLog([LogTag.IF_NOT_SILENCED], standardSuccessMessage);
    })
  };
}
