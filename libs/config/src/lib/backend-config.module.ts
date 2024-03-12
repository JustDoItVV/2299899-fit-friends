import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import BackendConfig from './backend.config';

export const ENV_FILE_PATH = '.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [BackendConfig],
      envFilePath: ENV_FILE_PATH,
    }),
  ],
})
export class BackendConfigModule {}
