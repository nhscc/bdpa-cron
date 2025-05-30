import { CliErrorMessage as UpstreamErrorMessage } from '@-xun/cli/error';
import { TAB } from 'rejoinder';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const ErrorMessage = {
  ...UpstreamErrorMessage,
  UnreadableConfigFile(path: string) {
    return `expected readable configuration file to exist at:\n${TAB}${path}\n\nIf this file does not already exist, please create it`;
  },
  InvalidConfigFile(key: string, path: string, problem: string | undefined) {
    return (
      `configuration key "${key}" is missing or has invalid value in file: ${path}` +
      (problem === undefined ? '' : `\n\nProblem: ${problem}`)
    );
  },
  UnimplementedTasks() {
    return `one or more of the given tasks have not been properly implemented by the developer`;
  }
};
