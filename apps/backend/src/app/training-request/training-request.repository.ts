import { BasePostgresRepository } from '@2299899-fit-friends/backend-core';
import { DefaultPagination } from '@2299899-fit-friends/consts';
import { TrainingRequestsPaginationQuery } from '@2299899-fit-friends/dtos';
import { PrismaClientService } from '@2299899-fit-friends/models';
import { Pagination, SortOption, TrainingRequest } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { TrainingRequestEntity } from './training-request.entity';

@Injectable()
export class TrainingRequestRepository extends BasePostgresRepository<
  TrainingRequestEntity,
  TrainingRequest
> {
  constructor(protected readonly clientService: PrismaClientService) {
    super(clientService, TrainingRequestEntity.fromObject);
  }

  private async getTrainingRequestsCount(
    where: Prisma.TrainingRequestWhereInput
  ): Promise<number> {
    return this.clientService.trainingRequest.count({ where });
  }

  private calculatePage(totalCount: number, limit: number): number {
    if (totalCount === 0) {
      return 1;
    }

    return Math.ceil(totalCount / limit);
  }

  public async save(
    entity: TrainingRequestEntity
  ): Promise<TrainingRequestEntity> {
    const pojoEntity = entity.toPOJO();
    const document = await this.clientService.trainingRequest.create({
      data: pojoEntity,
    });
    entity.id = document.id;
    return entity;
  }

  public async find(query: TrainingRequestsPaginationQuery): Promise<Pagination<TrainingRequestEntity>> {
    let limit = query.limit;

    if (query.limit < 1) {
      limit = 1;
    } else if (query.limit > DefaultPagination.Limit) {
      limit = DefaultPagination.Limit;
    }

    const where: Prisma.TrainingRequestWhereInput = {};
    if (query.authorId) {
      where.authorId = query.authorId;
    }
    if (query.targetId) {
      where.targetId = query.targetId;
    }

    const orderBy: Prisma.TrainingRequestOrderByWithRelationAndSearchRelevanceInput[] = [];
    if (query.sortOption === SortOption.CreatedAt) {
      orderBy.push({ createdAt: query.sortDirection });
    }
    orderBy.push({ id: query.sortDirection });

    const usersCount = await this.getTrainingRequestsCount(where);
    const totalPages = this.calculatePage(usersCount, limit);
    let currentPage = query.page;

    if (query.page < 1) {
      currentPage = 1;
    } else if (query.page > totalPages) {
      currentPage = totalPages;
    }

    const skip = (currentPage - 1) * limit;
    const documents = await this.clientService.trainingRequest.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      entities: documents.map((document) =>
        this.createEntityFromDocument(document)
      ),
      currentPage,
      totalPages,
      itemsPerPage: limit,
      totalItems: usersCount,
    };
  }

  public async findById(id: string): Promise<TrainingRequestEntity | null> {
    const document = await this.clientService.trainingRequest.findFirst({
      where: { id },
    });
    return document ? this.createEntityFromDocument(document) : null;
  }

  public async update(
    id: string,
    entity: TrainingRequestEntity
  ): Promise<TrainingRequestEntity> {
    const pojoEntity = entity.toPOJO();
    const updatedDocument = await this.clientService.trainingRequest.update({
      where: { id },
      data: pojoEntity,
    });
    return this.createEntityFromDocument(updatedDocument);
  }
}
