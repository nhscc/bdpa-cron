import { runProgram } from '@-xun/cli';

import type { GlobalExecutionContext } from 'universe:configure.ts';

/**
 * This is the simple CLI entry point executed directly by node.
 */
export default runProgram<GlobalExecutionContext>(
  import.meta.resolve('./commands'),
  import('universe:configure.ts')
);
