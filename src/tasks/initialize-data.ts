import type { GlobalExecutionContext } from 'universe:configure.ts';
import type { TargetProblem } from 'universe:constant.ts';
import type { TaskRunnerContext } from 'universe:util.ts';

export default async function task(
  target: TargetProblem[keyof TargetProblem],
  getConfig: GlobalExecutionContext['getConfig'],
  { listrLog }: TaskRunnerContext
) {
  listrLog.warn('This task is currently unimplemented');
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void target, getConfig, listrLog;
}
