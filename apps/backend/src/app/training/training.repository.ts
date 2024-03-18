import { BasePostgresRepository } from '@2299899-fit-friends/core';
import { PrismaClientService } from '@2299899-fit-friends/models';
import {
    Training, TrainingAuditory, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { TrainingEntity } from './training.entity';

@Injectable()
export class TrainingRepository extends BasePostgresRepository<TrainingEntity, Training> {
  constructor(
    protected readonly clientService: PrismaClientService
  ) {
    super(clientService, TrainingEntity.fromObject);
  }

  public async save(entity: TrainingEntity): Promise<TrainingEntity> {
    const pojoEntity = entity.toPOJO();
    delete pojoEntity.rating;
    const document = await this.clientService.training.create({ data: pojoEntity });
    entity.id = document.id;
    return entity;
  }

  public async findById(id: string): Promise<TrainingEntity | null> {
    const document = await this.clientService.training.findFirst({ where: { id } });
    return document
      ? this.createEntityFromDocument({
        ...document,
        level: document.level as TrainingLevel,
        type: document.type as TrainingType,
        duration: document.duration as TrainingDuration,
        gender: document.gender as TrainingAuditory,
      })
      : null;
  }

  public async update(id: string, entity: TrainingEntity): Promise<TrainingEntity> {
    const pojoEntity = entity.toPOJO();
    const updatedDocument = await this.clientService.training.update({
      where: { id },
      data: {
        ...pojoEntity,
      },
    });

    return this.createEntityFromDocument({
      ...updatedDocument,
      level: updatedDocument.level as TrainingLevel,
      type: updatedDocument.type as TrainingType,
      duration: updatedDocument.duration as TrainingDuration,
      gender: updatedDocument.gender as TrainingAuditory,
    });
  }
}
