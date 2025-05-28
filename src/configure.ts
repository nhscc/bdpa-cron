import { checkArrayNotEmpty } from '@-xun/cli';

import {
  makeStandardConfigureErrorHandlingEpilogue,
  makeStandardConfigureExecutionContext
} from '@-xun/cli/configure';

import { createDebugLogger, createGenericLogger } from 'rejoinder';

import {
  allActualTargetProblems,
  allInputTargets,
  globalDebuggerNamespace,
  globalLoggerNamespace,
  TargetDatabase,
  TargetProblem,
  TargetYear
} from 'universe:constant.ts';

import type {
  BfeBuilderObject,
  ConfigureErrorHandlingEpilogue,
  ConfigureExecutionContext
} from '@-xun/cli';

import type {
  StandardCommonCliArguments,
  StandardExecutionContext
} from '@-xun/cli/extensions';

import type { Arrayable } from 'type-fest';

import type {
  // ? Used in documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  withGlobalBuilder
} from 'universe:util.ts';

const rootGenericLogger = createGenericLogger({ namespace: globalLoggerNamespace });
const rootDebugLogger = createDebugLogger({ namespace: globalDebuggerNamespace });

export { $executionContext } from '@-xun/cli';

export type GlobalExecutionContext = StandardExecutionContext /* & {
  * See also: configureExecutionContext
} */;

/**
 * These properties will be available in the `argv` object of any command that
 * uses {@link withGlobalBuilder} to construct its `builder`.
 *
 * This type is manually synchronized with {@link globalCliArguments}, but the
 * keys may differ slightly (e.g. hyphens may be elided in favor of camelCase).
 *
 * @see {@link StandardCommonCliArguments}
 */
export type GlobalCliArguments = StandardCommonCliArguments & {
  targets: TargetProblem[];
};

/**
 * This {@link BfeBuilderObject} instance describes the CLI arguments available
 * in the `argv` object of any command that uses {@link withGlobalBuilder} to
 * construct its `builder`.
 *
 * This object is manually synchronized with {@link GlobalCliArguments}, but the
 * keys may differ slightly (e.g. hyphens may be elided in favor of camelCase).
 *
 * When providing a custom {@link BfeBuilderObject} instance to
 * {@link withGlobalBuilder}, any key specified in that instance that is also a
 * key in this object (`globalCliArguments`) will have its value merged with the
 * value in this object _instead_ of fully overwriting it. This means you can
 * pass minimal configuration values for the keys that are also in
 * `globalCliArguments` and those values will be merged over the corresponding
 * default configuration value in `globalCliArguments`.
 *
 * @see {@link StandardCommonCliArguments}
 */
export const globalCliArguments = {
  targets: {
    alias: 'target',
    array: true,
    choices: allInputTargets,
    default: allActualTargetProblems,
    defaultDescription: TargetProblem.All,
    check: checkArrayNotEmpty('--targets'),
    coerce(targets: Arrayable<(typeof allInputTargets)[number]>) {
      return Array.from(
        new Set(
          [targets].flat().flatMap((target) => {
            if (target === TargetProblem.All) {
              return allActualTargetProblems;
            }

            if (target in TargetYear) {
              return TargetYear[target as keyof TargetYear];
            }

            if (target in TargetDatabase) {
              return TargetDatabase[target as keyof TargetDatabase];
            }

            return target;
          })
        )
      );
    }
  }
} satisfies BfeBuilderObject<Record<string, unknown>, StandardExecutionContext>;

export const configureExecutionContext = async function (context) {
  const standardContextFactory = await makeStandardConfigureExecutionContext({
    rootGenericLogger,
    rootDebugLogger
  });

  const standardContext = await standardContextFactory(context);

  return {
    ...standardContext
    // * see also: GlobalExecutionContext
  };
} as ConfigureExecutionContext;

export const configureErrorHandlingEpilogue =
  makeStandardConfigureErrorHandlingEpilogue() as ConfigureErrorHandlingEpilogue;
