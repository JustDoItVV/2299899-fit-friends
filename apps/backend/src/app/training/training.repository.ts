import { BasePostgresRepository } from '@2299899-fit-friends/core';
import { PrismaClientService } from '@2299899-fit-friends/models';
import { Training } from '@2299899-fit-friends/types';
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
}
