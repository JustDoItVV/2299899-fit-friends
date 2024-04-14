import { BasePostgresRepository } from '@2299899-fit-friends/backend-core';
import { DefaultPagination } from '@2299899-fit-friends/consts';
import { OrderPaginationQuery } from '@2299899-fit-friends/dtos';
import { PrismaClientService } from '@2299899-fit-friends/models';
import {
    Order, OrderPaymentMethod, OrderSortOption, OrderType, Pagination, Training
} from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

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

  public async save(entity: OrderEntity): Promise<OrderEntity> {
    const pojoEntity = entity.toPOJO();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { trainingId: _, ...data} = pojoEntity;
    const document = await this.clientService.order.create({
      data: {
        ...data,
        training: { connect: { id: pojoEntity.trainingId } },
      },
    });
    entity.id = document.id;
    return entity;
  }

  public async find(query: OrderPaginationQuery, userId?: string): Promise<Pagination<OrderEntity>> {
    let limit = query.limit;
    if (query.limit < 1) {
      limit = 1;
    } else if (query.limit > DefaultPagination.Limit) {
      limit = DefaultPagination.Limit;
    }

    const allItems: unknown[] = await this.clientService.$queryRaw`
      SELECT COUNT(*)
      FROM public.orders
      JOIN public.trainings
      ON public.orders.training_id = public.trainings.id
      WHERE public.trainings.user_id = ${userId}
      GROUP BY public.orders.training_id, public.orders.price, public.trainings.id
      ORDER BY public.orders.training_id
    `;
    const documentsCount = allItems.length;
    const totalPages = this.calculatePage(documentsCount, limit);
    let currentPage = query.page;
    if (query.page < 1) {
      currentPage = 1;
    } else if (query.page > totalPages) {
      currentPage = totalPages;
    }
    const skip = (currentPage - 1) * limit;

    let orderField = '';
    if (query.sortOption === OrderSortOption.Amount) {
      orderField = `amount ${query.sortDirection}`;
    } else if (query.sortOption === OrderSortOption.OrderSum) {
      orderField = `order_sum ${query.sortDirection}`;
    }
    const orderField2 = `public.orders.training_id ${query.sortDirection}`;

    const ordersQueryRaw = `
      SELECT
        public.orders.training_id,
        public.orders.price,
        SUM(public.orders.amount) AS amount,
        SUM(public.orders.order_sum) AS order_sum
      FROM public.orders
      JOIN public.trainings
      ON public.orders.training_id = public.trainings.id
      WHERE public.trainings.user_id::text = '${userId}'
      GROUP BY public.orders.training_id, public.orders.price, public.trainings.id
      ORDER BY ${orderField ? orderField + ', ' : ''}${orderField2}
      OFFSET ${skip} ROWS
      FETCH NEXT ${limit} ROWS ONLY;
    `;

    const documents: {
      training_id: string,
      price: number,
      amount: bigint,
      order_sum: bigint,
      traininig?: Training,
    }[] = await this.clientService.$queryRawUnsafe(ordersQueryRaw);

    for (const document of documents) {
      const training = await this.clientService.training.findFirst({
        where: { id: document.training_id }
      }) as Training;
      document.traininig = training;
    }

    return {
      entities: documents.map((document) => {
        const entity = this.createEntityFromDocument({
          id: document.training_id,
          type: OrderType.Subscription,
          trainingId: document.training_id,
          price: document.price,
          amount: Number(document.amount),
          orderSum: Number(document.order_sum),
          paymentMethod: OrderPaymentMethod.Mir,
          training: document.traininig
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
