import { BasePostgresRepository } from '@2299899-fit-friends/core';
import { PrismaClientService } from '@2299899-fit-friends/models';
import {
    TrainingDuration, TrainingLevel, TrainingType, User, UserGender, UserRole
} from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends BasePostgresRepository<UserEntity, User> {
  constructor(protected readonly clientService: PrismaClientService) {
    super(clientService, UserEntity.fromObject);
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    const pojoEntity = entity.toPOJO();
    const document = await this.clientService.user.create({ data: {  ...pojoEntity, pageBackground: '' } });
    entity.id = document.id;
    return entity;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const document = await this.clientService.user.findFirst({ where: { id } });
    return document
      ? this.createEntityFromDocument({
        ...document,
        gender: document.gender as UserGender,
        role: document.role as UserRole,
        trainingLevel: document.trainingLevel as TrainingLevel,
        trainingType: document.trainingType as TrainingType[],
        trainingDuration: document.trainingDuration as TrainingDuration,
      })
      : null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.clientService.user.findFirst({ where: { email } });
    return document
      ? this.createEntityFromDocument({
        ...document,
        gender: document.gender as UserGender,
        role: document.role as UserRole,
        trainingLevel: document.trainingLevel as TrainingLevel,
        trainingType: document.trainingType as TrainingType[],
        trainingDuration: document.trainingDuration as TrainingDuration,
      })
      : null;
  }

  public async update(id: string, entity: UserEntity): Promise<UserEntity> {
    const pojoEntity = entity.toPOJO();
    const updatedDocument = await this.clientService.user.update({
      where: { id },
      data: { ...pojoEntity },
    });
    return this.createEntityFromDocument({
      ...updatedDocument,
      gender: updatedDocument.gender as UserGender,
      role: updatedDocument.role as UserRole,
      trainingLevel: updatedDocument.trainingLevel as TrainingLevel,
      trainingType: updatedDocument.trainingType as TrainingType[],
      trainingDuration: updatedDocument.trainingDuration as TrainingDuration,
    });
  }
}
