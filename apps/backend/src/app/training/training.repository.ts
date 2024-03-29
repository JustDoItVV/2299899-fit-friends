import { DefaultPagination } from '@2299899-fit-friends/consts';
import { BasePostgresRepository } from '@2299899-fit-friends/core';
import { TrainingPaginationQuery } from '@2299899-fit-friends/dtos';
import { PrismaClientService } from '@2299899-fit-friends/models';
import {
    Pagination, SortOption, Training, TrainingAuditory, TrainingDuration, TrainingLevel,
    TrainingType
} from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { TrainingEntity } from './training.entity';

@Injectable()
export class TrainingRepository extends BasePostgresRepository<TrainingEntity, Training> {
  constructor(
    protected readonly clientService: PrismaClientService
  ) {
    super(clientService, TrainingEntity.fromObject);
  }

  private async getTrainingsCount(where: Prisma.TrainingWhereInput): Promise<number> {
    return this.clientService.training.count({ where });
  }

  private calculatePage(totalCount: number, limit: number): number {
    if (totalCount === 0) {
      return 1;
    }

    return Math.ceil(totalCount / limit);
  }

  public async save(entity: TrainingEntity): Promise<TrainingEntity> {
    const pojoEntity = entity.toPOJO();
    const document = await this.clientService.training.create({ data: pojoEntity });
    entity.id = document.id;
    return entity;
  }

  public async find(query: TrainingPaginationQuery, userId?: string): Promise<Pagination<TrainingEntity>> {
    let limit = query.limit;
    if (query.limit < 1){
      limit = 1;
    } else if (query.limit > DefaultPagination.Limit) {
      limit = DefaultPagination.Limit;
    }

    const where: Prisma.TrainingWhereInput = {};
    where.price = { gte: query.price[0], lte: query.price[1] };
    where.calories = { gte: query.calories[0], lte: query.calories[1] };
    where.rating = { gte: query.rating[0], lte: query.rating[1] };

    if (userId) {
      where.userId = userId;
    }

    if (query.duration) {
      if (Array.isArray(query.duration)) {
        where.duration = { in: query.duration };
      } else {
        where.duration = query.duration;
      }
    }
    if (query.type) {
      if (Array.isArray(query.type)) {
        where.type = { in: query.type };
      } else {
        where.type = query.type;
      }
    }

    const orderBy: Prisma.TrainingOrderByWithRelationAndSearchRelevanceInput = {};
    if (query.sortOption === SortOption.CreatedAt) {
      orderBy.createdAt = query.sortDirection;
    }

    const documentsCount = await this.getTrainingsCount(where);
    const totalPages = this.calculatePage(documentsCount, limit);
    let currentPage = query.page;
    if (query.page < 1) {
      currentPage = 1;
    } else if (query.page > totalPages) {
      currentPage = totalPages;
    }

    const skip = (currentPage - 1) * limit;
    const documents = await this.clientService.training.findMany({ where, orderBy, skip, take: limit });

    return {
      entities: documents.map((document) => this.createEntityFromDocument({
        ...document,
        level: document.level as TrainingLevel,
        type: document.type as TrainingType,
        duration: document.duration as TrainingDuration,
        gender: document.gender as TrainingAuditory,
      })),
      currentPage,
      totalPages,
      itemsPerPage: limit,
      totalItems: documentsCount,
    };
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
