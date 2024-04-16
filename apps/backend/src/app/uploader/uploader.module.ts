import { BackendConfigModule } from '@2299899-fit-friends/config';
import { Module } from '@nestjs/common';

import { UploaderService } from './uploader.service';

@Module({
  imports: [
    BackendConfigModule,
  ],
  providers: [
    UploaderService,
  ],
  exports: [
    UploaderService,
  ],
})
export class UploaderModule {}
