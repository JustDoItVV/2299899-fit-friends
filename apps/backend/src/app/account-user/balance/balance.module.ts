import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { BalanceRepository } from './balance.repository';

@Module({
  imports: [
    PrismaClientModule,
  ],
  providers: [
    BalanceRepository,
  ],
  exports: [
    BalanceRepository,
  ],
})
export class BalanceModule {}
