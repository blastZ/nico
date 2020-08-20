import Router from '@koa/router';

import {
  Logger,
  Context,
  Next,
  HttpMethod,
  ConfigRoutes,
  ConfigRoute,
  CustomMiddlewares,
  InputConfig,
  DefaultState,
  DefaultCustom,
} from '../../../typings';

import logger from '../../utils/logger';
import getMiddlewares from './get-middlewares';

export default function getRouterMiddleware(
  router: Router<DefaultState, DefaultCustom>,
  config: InputConfig,
  options: {
    routeMiddlewares: string[];
    customMiddlewares: CustomMiddlewares;
    logger: Logger;
  },
) {
  const routesConfig = config.routes || {};

  const testMethod = /^(get|post|delete|put|patch|options|all)$/;

  const mountRoutes = (configRoutes: ConfigRoutes, prefix = '') => {
    Object.entries(configRoutes).forEach(([key, value]) => {
      const isPrefix = key.startsWith('/');

      if (!isPrefix) {
        const [methodStr, route = ''] = key.split(' ');
        const method = methodStr.toLowerCase();

        if (!testMethod.test(method)) {
          logger.error('invalid route', key);
          return;
        }

        const middlewares = getMiddlewares(value as ConfigRoute, {
          securityConfig: config.security,
          routeMiddlewares: options.routeMiddlewares,
          logger: options.logger,
          customMiddlewares: options.customMiddlewares,
        });

        router[method as HttpMethod](prefix + route, ...middlewares);
      } else {
        mountRoutes(value as ConfigRoutes, prefix + key);
      }
    });
  };

  mountRoutes(routesConfig);

  return async function routerMiddleware(ctx: Context, next: Next) {
    await next();
  };
}
