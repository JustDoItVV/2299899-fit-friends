import { BasePostgresRepository } from '@2299899-fit-friends/backend-core';
import { DefaultPagination } from '@2299899-fit-friends/consts';
import { PaginationQuery } from '@2299899-fit-friends/dtos';
import { PrismaClientService } from '@2299899-fit-friends/models';
import { Notification, Pagination, SortOption } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { NotificationEntity } from './notification.entity';

@Injectable()
export class NotificationRepository extends BasePostgresRepository<NotificationEntity, Notification> {
  constructor(protected readonly clientService: PrismaClientService) {
    super(clientService, NotificationEntity.fromObject);
  }

  private async getNotificationsCount(where: Prisma.NotificationWhereInput): Promise<number> {
    return this.clientService.notification.count({ where });
  }

  private calculatePage(totalCount: number, limit: number): number {
    if (totalCount === 0) {
      return 1;
    }

    return Math.ceil(totalCount / limit);
  }

  public async save(entity: NotificationEntity): Promise<NotificationEntity> {
    const pojoEntity = entity.toPOJO();
    const document = await this.clientService.notification.create({
      data: pojoEntity,
    });
    entity.id = document.id;
    return entity;
  }

  public async findById(id: string): Promise<NotificationEntity | null> {
    const document = await this.clientService.notification.findFirst({
      where: { id },
    });
    return document ? this.createEntityFromDocument(document) : null;
  }

  public async find(query: PaginationQuery, userId: string): Promise<Pagination<NotificationEntity>> {
    let limit = query.limit;
    if (query.limit < 1) {
      limit = 1;
    } else if (query.limit > DefaultPagination.Limit) {
      limit = DefaultPagination.Limit;
    }

    const where: Prisma.NotificationWhereInput = {};
    where.userId = userId;

    const orderBy: Prisma.NotificationOrderByWithRelationAndSearchRelevanceInput[] = [];
    if (query.sortOption === SortOption.CreatedAt) {
      orderBy.push({ createdAt: query.sortDirection });
    }
    orderBy.push({ id: query.sortDirection });

    const documentsCount = await this.getNotificationsCount(where);
    const totalPages = this.calculatePage(documentsCount, limit);
    let currentPage = query.page;
    if (query.page < 1) {
      currentPage = 1;
    } else if (query.page > totalPages) {
      currentPage = totalPages;
    }

    const skip = (currentPage - 1) * limit;
    const documents = await this.clientService.notification.findMany({
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
      totalItems: documentsCount,
    };
  }

  public async deleteById(id: string): Promise<void> {
    await this.clientService.notification.delete({ where: { id } });
  }
}
