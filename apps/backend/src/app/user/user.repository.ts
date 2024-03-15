import { DefaultPagination } from '@2299899-fit-friends/consts';
import { BasePostgresRepository } from '@2299899-fit-friends/core';
import { UserPaginationQuery } from '@2299899-fit-friends/dtos';
import { PrismaClientService } from '@2299899-fit-friends/models';
import {
    Pagination, SortOption, TrainingDuration, TrainingLevel, TrainingType, User, UserGender,
    UserRole, UserSortOption
} from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends BasePostgresRepository<UserEntity, User> {
  constructor(protected readonly clientService: PrismaClientService) {
    super(clientService, UserEntity.fromObject);
  }

  private async getUsersCount(where: Prisma.UserWhereInput): Promise<number> {
    return this.clientService.user.count({ where });
  }

  private calculatePage(totalCount: number, limit: number): number {
    if (totalCount === 0) {
      return 1;
    }

    return Math.ceil(totalCount / limit);
  }

  public async save(entity: UserEntity): Promise<UserEntity> {
    const pojoEntity = entity.toPOJO();
    const document = await this.clientService.user.create({ data: pojoEntity });
    entity.id = document.id;
    return entity;
  }

  public async find(query: UserPaginationQuery): Promise<Pagination<UserEntity>> {
    let limit = query.limit;

    if (query.limit < 1){
      limit = 1;
    } else if (query.limit > DefaultPagination.Limit) {
      limit = DefaultPagination.Limit;
    }

    const where: Prisma.UserWhereInput = {};
    where.location = query.location ? query.location : undefined;
    if (query.specialization) {
      if (Array.isArray(query.specialization)) {
        where.trainingType = { hasEvery: query.specialization };
      } else {
        where.trainingType = { has: query.specialization};
      }
    }
    where.trainingLevel = query.level ? query.level : undefined;

    const orderBy: Prisma.UserOrderByWithRelationAndSearchRelevanceInput = {};
    if (query.sortOption === SortOption.CreatedAt) {
      orderBy.createdAt = query.sortDirection;
    } else if (query.sortOption === UserSortOption.Role) {
      orderBy.role = query.sortDirection;
    }

    const usersCount = await this.getUsersCount(where);
    const totalPages = this.calculatePage(usersCount, limit);
    let currentPage = query.page;

    if (query.page < 1) {
      currentPage = 1;
    } else if (query.page > totalPages) {
      currentPage = totalPages;
    }

    const skip = (currentPage - 1) * limit;
    const documents = await this.clientService.user.findMany({ where, orderBy, skip, take: limit });

    return {
      entities: documents.map((document) => this.createEntityFromDocument({
        ...document,
        gender: document.gender as UserGender,
        role: document.role as UserRole,
        trainingLevel: document.trainingLevel as TrainingLevel,
        trainingType: document.trainingType as TrainingType[],
        trainingDuration: document.trainingDuration as TrainingDuration,
      })),
      currentPage,
      totalPages,
      itemsPerPage: limit,
      totalItems: usersCount,
    };
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
