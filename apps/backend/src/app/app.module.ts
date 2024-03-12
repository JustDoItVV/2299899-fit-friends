import { BackendConfigModule } from '@2299899-fit-friends/config';
import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';

@Module({
  imports: [BackendConfigModule, UserModule],
})
export class AppModule {}
