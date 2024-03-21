import { DefaultPagination } from '@2299899-fit-friends/consts';
import { BasePostgresRepository } from '@2299899-fit-friends/core';
import { PaginationQuery } from '@2299899-fit-friends/dtos';
import { PrismaClientService } from '@2299899-fit-friends/models';
import { Balance, Pagination, SortOption } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BalanceEntity } from './balance.entity';

@Injectable()
export class BalanceRepository extends BasePostgresRepository<BalanceEntity, Balance> {
  constructor(
    protected readonly clientService: PrismaClientService,
  ) {
    super(clientService, BalanceEntity.fromObject);
  }

  private async getbalancesCount(where: Prisma.BalanceWhereInput): Promise<number> {
    return this.clientService.balance.count({ where });
  }

  private calculatePage(totalCount: number, limit: number): number {
    if (totalCount === 0) {
      return 1;
    }

    return Math.ceil(totalCount / limit);
  }

  public async save(entity: BalanceEntity): Promise<BalanceEntity> {
    const pojoEntity = entity.toPOJO();
    const document = await this.clientService.balance.create({ data: pojoEntity });
    entity.id = document.id;
    return entity;
  }

  public async find(query: PaginationQuery, userId?: string): Promise<Pagination<BalanceEntity>> {
    let limit = query.limit;
    if (query.limit < 1){
      limit = 1;
    } else if (query.limit > DefaultPagination.Limit) {
      limit = DefaultPagination.Limit;
    }

    const where: Prisma.BalanceWhereInput = {};
    if (userId) {
      where.userId = userId;
    }

    const orderBy: Prisma.BalanceOrderByWithRelationAndSearchRelevanceInput = {};
    if (query.sortOption === SortOption.CreatedAt) {
      orderBy.createdAt = query.sortDirection;
    }

    const documentsCount = await this.getbalancesCount(where);
    const totalPages = this.calculatePage(documentsCount, limit);
    let currentPage = query.page;
    if (query.page < 1) {
      currentPage = 1;
    } else if (query.page > totalPages) {
      currentPage = totalPages;
    }

    const skip = (currentPage - 1) * limit;
    const documents = await this.clientService.balance.findMany({ where, orderBy, skip, take: limit });

    return {
      entities: documents.map((document) => this.createEntityFromDocument(document)),
      currentPage,
      totalPages,
      itemsPerPage: limit,
      totalItems: documentsCount,
    };
  }

  public async findById(id: string): Promise<BalanceEntity | null> {
    const document = await this.clientService.balance.findFirst({ where: { id } });
    return document ? this.createEntityFromDocument(document) : null;
  }

  public async findByTrainingId(trainingId: string): Promise<BalanceEntity | null> {
    const document = await this.clientService.balance.findFirst({ where: { trainingId } });
    return document ? this.createEntityFromDocument(document) : null;
  }

  public async update(id: string, entity: BalanceEntity): Promise<BalanceEntity> {
    const pojoEntity = entity.toPOJO();
    const updatedDocument = await this.clientService.balance.update({
      where: { id },
      data: pojoEntity,
    });
    return this.createEntityFromDocument(updatedDocument);
  }
}
