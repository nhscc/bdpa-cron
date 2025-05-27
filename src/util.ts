import { $executionContext } from '@-xun/cli';
import { withStandardBuilder, withStandardUsage } from '@-xun/cli/extensions';

import { globalCliArguments } from 'universe:configure.ts';

import type { Arguments } from '@-xun/cli';
import type { GlobalCliArguments, GlobalExecutionContext } from 'universe:configure.ts';

/**
 * A version of {@link withStandardBuilder} that expects `CustomCliArguments` to
 * extend {@link GlobalCliArguments} and implements any related global handler
 * functionality.
 *
 * {@link globalCliArguments} is included in `additionalCommonOptions`
 * automatically. See {@link withStandardBuilder} for more details on how this
 * function semi-deep merges various common option configurations.
 */
export function withGlobalBuilder<CustomCliArguments extends GlobalCliArguments>(
  ...[customBuilder, settings]: Parameters<
    typeof withStandardBuilder<CustomCliArguments, GlobalExecutionContext>
  >
): ReturnType<typeof withStandardBuilder<CustomCliArguments, GlobalExecutionContext>> {
  const [globalBuilder, withStandardHandlerExtensions] = withStandardBuilder<
    CustomCliArguments,
    GlobalExecutionContext
  >(customBuilder, {
    ...settings,
    // ...
    additionalCommonOptions: [
      globalCliArguments,
      ...(settings?.additionalCommonOptions || [])
    ]
  });

  return [
    globalBuilder,
    function withGlobalHandler(customHandler) {
      return withStandardHandlerExtensions(async function customGlobalHandler(argv) {
        const {
          [$executionContext]: { standardDebug }
          // ? Work around weirdness with BfeStrictArguments's OmitIndexSignature
        } = argv as Arguments<CustomCliArguments, GlobalExecutionContext>;

        const debug = standardDebug.extend('handler-wrapper');

        debug('entered customHandler wrapper function');

        // ...

        debug(
          'exiting customHandler wrapper function (triggering actual customHandler)'
        );

        return customHandler?.(argv);
      });
    }
  ];
}

export { withStandardUsage as withGlobalUsage };
