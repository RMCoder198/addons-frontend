/* @flow */
import * as React from 'react';
import config from 'config';

import GenericError from 'core/components/ErrorPage/GenericError';
import NotFound from 'core/components/ErrorPage/NotFound';
import log from 'core/logger';
import { getDisplayName } from 'core/utils';
import type { ConfigType } from 'core/types/config';

export const getErrorComponent = (status: number | null) => {
  switch (status) {
    case 404:
      return NotFound;
    default:
      return GenericError;
  }
};

/*
 * A decorator to render a 404 when a config key is false.
 *
 * For example, if you had a config key like this:
 *
 * module.exports = {
 *   allowMyComponent: false,
 * };
 *
 * then you could make your component appear as a 404 like this:
 *
 * class MyComponent extends React.Component {
 *   render() { ... }
 * }
 *
 * export default compose(
 *   render404IfConfigKeyIsFalse('allowMyComponent'),
 * )(MyComponent);
 */
export function render404IfConfigKeyIsFalse(
  configKey: string,
  { _config = config }: {| _config: ConfigType |} = {},
) {
  if (!configKey) {
    throw new TypeError('configKey cannot be empty');
  }

  return (Component: React.ComponentType<any>) => (props: any) => {
    if (!_config.get(configKey)) {
      log.debug(
        `config.${configKey} was false; not rendering ${getDisplayName(
          Component,
        )}`,
      );
      return <NotFound />;
    }

    return <Component {...props} />;
  };
}
