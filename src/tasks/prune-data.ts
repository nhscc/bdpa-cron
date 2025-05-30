import type { GlobalExecutionContext } from 'universe:configure.ts';
import type { TargetProblem } from 'universe:constant.ts';
import type { TaskRunnerContext } from 'universe:util.ts';

export default async function task(
  target: TargetProblem[keyof TargetProblem],
  getConfig: GlobalExecutionContext['getConfig'],
  { listrLog }: TaskRunnerContext
) {
  const x = getConfig('x.y', 'string');
  void listrLog, x;
}
