import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import BackendConfig from './backend.config';
import MailConfig from './mail.config';

export const ENV_FILE_PATH = '.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [BackendConfig, MailConfig],
      envFilePath: ENV_FILE_PATH,
    }),
  ],
})
export class BackendConfigModule {}
