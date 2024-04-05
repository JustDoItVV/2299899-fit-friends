import { BasePostgresRepository } from '@2299899-fit-friends/backend-core';
import { DefaultPagination } from '@2299899-fit-friends/consts';
import { OrderPaginationQuery } from '@2299899-fit-friends/dtos';
import { PrismaClientService } from '@2299899-fit-friends/models';
import {
    Order, OrderPaymentMethod, OrderSortOption, OrderType, Pagination, TrainingAuditory,
    TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { TrainingEntity } from '../../training/training.entity';
import { OrderEntity } from './order.entity';

@Injectable()
export class OrderRepository extends BasePostgresRepository<OrderEntity, Order> {
  constructor(protected readonly clientService: PrismaClientService) {
    super(clientService, OrderEntity.fromObject);
  }

  private async getOrdersCount(where: Prisma.OrderWhereInput): Promise<number> {
    return this.clientService.order.count({ where });
  }

  private calculatePage(totalCount: number, limit: number): number {
    if (totalCount === 0) {
      return 1;
    }

    return Math.ceil(totalCount / limit);
  }

  public async find(query: OrderPaginationQuery, userId?: string): Promise<Pagination<OrderEntity>> {
    let limit = query.limit;
    if (query.limit < 1) {
      limit = 1;
    } else if (query.limit > DefaultPagination.Limit) {
      limit = DefaultPagination.Limit;
    }

    const where: Prisma.OrderWhereInput = {};
    if (userId) {
      where.training = { userId };
    }

    const orderBy: Prisma.OrderOrderByWithRelationAndSearchRelevanceInput = {};
    if (query.sortOption === OrderSortOption.CreatedAt) {
      orderBy.createdAt = query.sortDirection;
    } else if (query.sortOption === OrderSortOption.Amount) {
      orderBy.amount = query.sortDirection;
    } else if (query.sortOption === OrderSortOption.OrderSum) {
      orderBy.orderSum = query.sortDirection;
    }

    const documentsCount = await this.getOrdersCount(where);
    const totalPages = this.calculatePage(documentsCount, limit);
    let currentPage = query.page;
    if (query.page < 1) {
      currentPage = 1;
    } else if (query.page > totalPages) {
      currentPage = totalPages;
    }

    const skip = (currentPage - 1) * limit;
    const documents = await this.clientService.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { training: true },
    });

    return {
      entities: documents.map((document) => {
        const entity = this.createEntityFromDocument({
          ...document,
          type: document.type as OrderType,
          paymentMethod: document.paymentMethod as OrderPaymentMethod,
          training: new TrainingEntity().populate({
            ...document.training,
            level: document.training.level as TrainingLevel,
            type: document.training.type as TrainingType,
            duration: document.training.duration as TrainingDuration,
            gender: document.training.gender as TrainingAuditory,
          }),
        });
        return entity;
      }),
      currentPage,
      totalPages,
      itemsPerPage: limit,
      totalItems: documentsCount,
    };
  }
}
