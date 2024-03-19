import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { OrderRepository } from './order.repository';

@Module({
  imports: [
    PrismaClientModule,
  ],
  providers: [
    OrderRepository,
  ],
  exports: [
    OrderRepository,
  ],
})
export class OrderModule {}
