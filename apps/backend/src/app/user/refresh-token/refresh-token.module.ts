import { BackendConfigModule } from '@2299899-fit-friends/config';
import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { RefreshTokenRepository } from './refresh-token.repository';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [PrismaClientModule, BackendConfigModule],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
