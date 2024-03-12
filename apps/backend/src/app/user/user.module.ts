import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [PrismaClientModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
