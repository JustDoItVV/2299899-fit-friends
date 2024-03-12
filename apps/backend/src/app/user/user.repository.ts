import { BasePostgresRepository } from '@2299899-fit-friends/core';
import { PrismaClientService } from '@2299899-fit-friends/models';
import {
  TrainingDuration,
  TrainingLevel,
  TrainingType,
  User,
  UserGender,
  UserRole,
} from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends BasePostgresRepository<UserEntity, User> {
  constructor(protected readonly clientService: PrismaClientService) {
    super(clientService, UserEntity.fromObject);
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const document = await this.clientService.user.findFirst({ where: { id } });
    return this.createEntityFromDocument({
      ...document,
      gender: document.gender as UserGender,
      role: document.role as UserRole,
      trainingLevel: document.trainingLevel as TrainingLevel,
      trainingType: document.trainingType as TrainingType[],
      trainingDuration: document.trainingDuration as TrainingDuration,
    });
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const document = await this.clientService.user.findFirst({
      where: { email },
    });
    return this.createEntityFromDocument({
      ...document,
      gender: document.gender as UserGender,
      role: document.role as UserRole,
      trainingLevel: document.trainingLevel as TrainingLevel,
      trainingType: document.trainingType as TrainingType[],
      trainingDuration: document.trainingDuration as TrainingDuration,
    });
  }
}
