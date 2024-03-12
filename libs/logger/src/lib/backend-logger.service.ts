import { Injectable } from '@nestjs/common';

import { logger } from './winston.config';

const CONTEXT = 'Backend API';

@Injectable()
export class BackendLoggerService {
  log(message: string) {
    logger.info(message, { context: CONTEXT });
  }

  error(message: string) {
    logger.error(message, { context: CONTEXT });
  }

  warn(message: string) {
    logger.warn(message, { context: CONTEXT });
  }

  debug(message: string) {
    logger.debug(message, { context: CONTEXT });
  }
}
