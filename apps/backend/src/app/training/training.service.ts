import { TrainingErrorMessage } from '@2299899-fit-friends/consts';
import { CreateTrainingDto } from '@2299899-fit-friends/dtos';
import { TrainingFilesPayload } from '@2299899-fit-friends/types';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UploaderService } from '../uploader/uploader.service';
import { TrainingEntity } from './training.entity';
import { TrainingRepository } from './training.repository';

@Injectable()
export class TrainingService {
  constructor(
    private readonly trainingRepository: TrainingRepository,
    private readonly uploaderService: UploaderService,
  ) {}

  public async create(dto: CreateTrainingDto, userId: string, files: TrainingFilesPayload): Promise<TrainingEntity> {
    const entity = TrainingEntity.fromDto(dto, userId);

    for (const key of Object.keys(files)) {
      if (files[key] && files[key].length > 0) {
        const path = await this.uploaderService.saveFile(files[key][0]);
        entity[key] = path;
      }
    }

    const document = await this.trainingRepository.save(entity);
    return document;
  }

  public async getById(id: string): Promise<TrainingEntity> {
    const document = await this.trainingRepository.findById(id);

    if (!document) {
      throw new NotFoundException(TrainingErrorMessage.NotFound);
    }

    return document;
  }
}
