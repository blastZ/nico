import custom from './custom';
import security from './security';
import responses from './responses';
import routes from './routes';
import logger from './logger';

import { Config } from '../../typings';

const config: Config = {
  custom,
  routes,
  security,
  responses,
  logger,
  serve: {},
  advancedConfigs: {
    forceExitTime: 10 * 1000,
  },
  helpers: {},
};

export default config;
