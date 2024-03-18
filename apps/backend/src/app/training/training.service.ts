import { TrainingErrorMessage } from '@2299899-fit-friends/consts';
import { CreateTrainingDto, UpdateTrainingDto } from '@2299899-fit-friends/dtos';
import { TokenPayload, TrainingFilesPayload } from '@2299899-fit-friends/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

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

  public async update(payload: TokenPayload, id: string, dto: UpdateTrainingDto, files: TrainingFilesPayload) {
    const training = await this.trainingRepository.findById(id);

    if (!training) {
      throw new NotFoundException(TrainingErrorMessage.NotFound);
    }

    if (training.userId !== payload.userId) {
      throw new ForbiddenException(TrainingErrorMessage.UpdateForbidden);
    }

    let hasChanges = false;

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && training[key] !== value) {
        training[key] = value;
        hasChanges = true;
      }

      if (files) {
        if (files.backgroundPicture && files.backgroundPicture.length > 0) {
          if (training.backgroundPicture) {
            await this.uploaderService.deleteFile(training.backgroundPicture);
          }
          const backgroundPicturePath = await this.uploaderService.saveFile(files.backgroundPicture[0]);
          training.backgroundPicture = backgroundPicturePath;
        }

        if (files.video && files.video.length > 0) {
          if (training.video) {
            await this.uploaderService.deleteFile(training.video);
          }
          const videoPath = await this.uploaderService.saveFile(files.video[0]);
          training.video = videoPath;
        }
      }
    }

    if (!hasChanges) {
      return training;
    }

    return await this.trainingRepository.update(id, training);
  }

}
