import { OrderPaginationQuery, OrderRdo, TrainingRdo } from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { Pagination } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { OrderRepository } from './order/order.repository';

@Injectable()
export class AccountTrainerService {
  constructor(
    private readonly orderRepository: OrderRepository,
  ) {}

  public async getTrainerOrdersByQuery(query: OrderPaginationQuery, userId: string): Promise<Pagination<OrderRdo>> {
    const pagination = await this.orderRepository.find(query, userId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => {
        const rdo = fillDto(OrderRdo, entity.toPOJO());
        rdo.training = fillDto(TrainingRdo, entity.training.toPOJO());
        return rdo;
      }),
    };
    return paginationResult;
  }
}
