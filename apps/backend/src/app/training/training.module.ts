import { PrismaClientModule } from '@2299899-fit-friends/models';
import { Module } from '@nestjs/common';

import { UploaderModule } from '../uploader/uploader.module';
import { TrainingController } from './training.controller';
import { TrainingRepository } from './training.repository';
import { TrainingService } from './training.service';

@Module({
  imports: [
    PrismaClientModule,
    UploaderModule,
  ],
  controllers: [
    TrainingController,
  ],
  providers: [
    TrainingRepository,
    TrainingService,
  ],
  exports: [
    TrainingRepository,
    TrainingService,
  ],
})
export class TrainingModule {}
