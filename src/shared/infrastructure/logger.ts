import pino from 'pino';

import { env } from '../../main/config/env';

export const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
});
