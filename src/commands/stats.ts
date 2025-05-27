import { CommandNotImplementedError } from '@-xun/cli';
import { scriptBasename } from '@-xun/cli/util';

import { globalCliName } from 'universe:constant.ts';
import { withGlobalBuilder, withGlobalUsage } from 'universe:util.ts';

import type { AsStrictExecutionContext, RootConfiguration } from '@-xun/cli';
import type { GlobalCliArguments, GlobalExecutionContext } from 'universe:configure.ts';

export type CustomCliArguments = GlobalCliArguments;

export default function command({
  standardDebug
}: AsStrictExecutionContext<GlobalExecutionContext>): RootConfiguration<
  CustomCliArguments,
  GlobalExecutionContext
> {
  const [builder, withGlobalHandler] = withGlobalBuilder<CustomCliArguments>();

  return {
    name: globalCliName,
    builder,
    description: "A CLI tool for keeping HSCC's Mongo Atlas clusters alive and healthy",
    usage: withGlobalUsage(),
    handler: withGlobalHandler(function ({
      $0: scriptFullName,
      hush: isHushed,
      quiet: isQuieted,
      silent: isSilenced,
      targets
    }) {
      const debug = standardDebug.extend(`handler-${scriptBasename(scriptFullName)}`);

      debug('entered handler');

      debug('targets: %O', targets);
      debug('isHushed: %O', isHushed);
      debug('isQuieted: %O', isQuieted);
      debug('isSilenced: %O', isSilenced);

      throw new CommandNotImplementedError();
    })
  };
}
