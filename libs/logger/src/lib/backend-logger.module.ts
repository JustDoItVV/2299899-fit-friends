import { Module } from '@nestjs/common';

import { BackendLoggerService } from './backend-logger.service';

export const ENV_FILE_PATH = '.env';

@Module({
  providers: [BackendLoggerService],
  exports: [BackendLoggerService],
})
export class BackendLoggerModule {}
