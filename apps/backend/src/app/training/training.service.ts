import { randomUUID } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { FilesPayload } from '@2299899-fit-friends/backend-core';
import { MockTrainingBackgroundPicture, TrainingErrorMessage } from '@2299899-fit-friends/consts';
import {
    CreateTrainingDto, TrainingPaginationQuery, TrainingRdo, UpdateTrainingDto
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { Pagination, TokenPayload } from '@2299899-fit-friends/types';
import { ForbiddenException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';

import { MailNotificataionEntity } from '../mail-notification/mail-notification.entity';
import { MailNotificationRepository } from '../mail-notification/mail-notification.repository';
import { UploaderService } from '../uploader/uploader.service';
import { UserRepository } from '../user/user.repository';
import { TrainingEntity } from './training.entity';
import { TrainingRepository } from './training.repository';

@Injectable()
export class TrainingService {
  constructor(
    private readonly trainingRepository: TrainingRepository,
    private readonly uploaderService: UploaderService,
    private readonly mailNotificationRepository: MailNotificationRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async create(dto: CreateTrainingDto, userId: string, files: FilesPayload): Promise<TrainingEntity> {
    const entity = TrainingEntity.fromDto(dto, userId);

    for (const key of Object.keys(files)) {
      if (files[key] && files[key].length > 0) {
        const path = await this.uploaderService.saveFile(files[key][0]);
        entity[key] = path;
      }
    }

    const uploadPath = join(
      this.uploaderService.getUploadDirectory(),
      this.uploaderService.getSubDirectoryUpload()
    );
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const pictureNumber = Math.floor(Math.random() * (MockTrainingBackgroundPicture.Count - 1)) + 1;
    const mockBackgroundPictureName = `${MockTrainingBackgroundPicture.Prefix}${pictureNumber}${MockTrainingBackgroundPicture.Suffix}`;
    const backgroundPictureName = `${randomUUID()}-${mockBackgroundPictureName}`;
    copyFileSync(
      join(`${this.uploaderService.getPublicDirectory()}/img/content`, mockBackgroundPictureName),
      join(uploadPath, backgroundPictureName)
    );
    const backgroundPicture = join(
      this.uploaderService.getSubDirectoryUpload(),
      backgroundPictureName
    );
    entity.backgroundPicture = backgroundPicture;

    const document = await this.trainingRepository.save(entity);

    const trainer = await this.userRepository.findById(userId);
    await Promise.all(
      trainer.subscribers.map((subscriber) => {
        const mailNotificationEntity = MailNotificataionEntity.fromObject({
          authorId: trainer.id,
          targetId: subscriber,
          text: `Новая тренировка "${document.title}"`,
        });
        return this.mailNotificationRepository.save(mailNotificationEntity);
      })
    );

    return document;
  }

  public async getById(id: string): Promise<TrainingEntity> {
    const document = await this.trainingRepository.findById(id);

    if (!document) {
      throw new NotFoundException(TrainingErrorMessage.NotFound);
    }

    return document;
  }

  public async getByQuery(query: TrainingPaginationQuery, userId?: string): Promise<Pagination<TrainingRdo>> {
    const pagination = await this.trainingRepository.find(query, userId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) =>
        fillDto(TrainingRdo, entity.toPOJO())
      ),
    };
    return paginationResult;
  }

  public async update(payload: TokenPayload, id: string, dto: UpdateTrainingDto, files: FilesPayload) {
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
    }

    if (files) {
      if (files.backgroundPicture && files.backgroundPicture.length > 0) {
        if (training.backgroundPicture) {
          await this.uploaderService.deleteFile(training.backgroundPicture);
        }
        const backgroundPicturePath = await this.uploaderService.saveFile(
          files.backgroundPicture[0]
        );
        training.backgroundPicture = backgroundPicturePath;
        hasChanges = true;
      }

      if (files.video && files.video.length > 0) {
        if (training.video) {
          await this.uploaderService.deleteFile(training.video);
        }
        const videoPath = await this.uploaderService.saveFile(files.video[0]);
        training.video = videoPath;
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return training;
    }

    return await this.trainingRepository.update(id, training);
  }

  public async getBackgroundPicture(id: string): Promise<string> {
    const training = await this.getById(id);

    if (!training.backgroundPicture) {
      throw new NotFoundException(TrainingErrorMessage.NoFileUploaded);
    }

    return await this.uploaderService.getImageUrl(training.backgroundPicture);
  }

  public async getVideo(id: string): Promise<StreamableFile> {
    const training = await this.getById(id);

    if (!training.video) {
      throw new NotFoundException(TrainingErrorMessage.NoFileUploaded);
    }

    return await this.uploaderService.getFile(training.video);
  }
}
