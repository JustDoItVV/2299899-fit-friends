import { BackendConfigModule } from '@2299899-fit-friends/config';
import { getMailerAsyncOptions } from '@2299899-fit-friends/helpers';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { MailNotificationModule } from '../mail-notification/mail-notification.module';
import { TrainingModule } from '../training/training.module';
import { UserModule } from '../user/user.module';
import { AccountUserController } from './account-user.controller';
import { AccountUserService } from './account-user.service';
import { BalanceModule } from './balance/balance.module';

@Module({
  imports: [
    UserModule,
    BalanceModule,
    TrainingModule,
    MailNotificationModule,
    MailerModule.forRootAsync(getMailerAsyncOptions('mail.mail')),
    BackendConfigModule,
  ],
  controllers: [
    AccountUserController,
  ],
  providers: [
    AccountUserService,
  ],
})
export class AccountUserModule {}
