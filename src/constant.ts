/**
 * The name of the command line interface.
 */
export const globalCliName = 'bdpa-cron';

/**
 * The CLI-wide namespace that appears in logger output.
 */
export const globalLoggerNamespace = globalCliName;

/**
 * The CLI-wide namespace that appears in debugger output.
 */
export const globalDebuggerNamespace = globalCliName;

/**
 * The HSCC MongoDB Atlas APIs that tasks will be run against.
 *
 * @see {@link targets}, {@link allActualTargets}
 */
export enum Target {
  InitializeData = 'initialize-data',
  BanHammer = 'ban-hammer',
  PruneData = 'prune-data',
  SimulateActivity = 'simulate-activity',
  All = 'all'
}

/**
 * @see {@link Target}, {@link allActualTargets}
 */
export const targets = Object.values(Target);

/**
 * @see {@link Target}, {@link targets}
 */
export const allActualTargets = targets.filter((target) => target !== Target.All);
