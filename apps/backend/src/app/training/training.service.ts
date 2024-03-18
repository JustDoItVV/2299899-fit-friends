import { CreateTrainingDto } from '@2299899-fit-friends/dtos';
import { TrainingFilesPayload } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { UploaderService } from '../uploader/uploader.service';
import { TrainingEntity } from './training.entity';
import { TrainingRepository } from './training.repository';

@Injectable()
export class TrainingService {
  constructor(
    private readonly trainingRepository: TrainingRepository,
    private readonly uploadService: UploaderService,
  ) {}

  public async create(dto: CreateTrainingDto, userId: string, files: TrainingFilesPayload): Promise<TrainingEntity> {
    const entity = TrainingEntity.fromDto(dto, userId);
    entity.backgroundPicture = await this.uploadService.saveFile(files.backgroundPicture[0]);
    entity.video = await this.uploadService.saveFile(files.video[0]);

    // for (const key of Object.keys(files)) {
    //   if (files[key] && files[key].length > 0) {
    //     const path = await this.uploaderService.saveFile(files[key][0]);
    //     entity[key] = path;
    //   }
    // }

    const document = await this.trainingRepository.save(entity);
    return document;
  }
}
