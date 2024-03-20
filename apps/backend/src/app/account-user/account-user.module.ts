import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AccountUserController } from './account-user.controller';
import { AccountUserService } from './account-user.service';

@Module({
  imports: [
    UserModule,
  ],
  controllers: [
    AccountUserController,
  ],
  providers: [
    AccountUserService,
  ],
})
export class AccountUserModule {}
