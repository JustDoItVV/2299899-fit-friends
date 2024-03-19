import {
    OrderPaginationQuery, OrderRdo, PaginationQuery, TrainingRdo, UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { Pagination } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '../user/user.repository';
import { OrderRepository } from './order/order.repository';

@Injectable()
export class AccountTrainerService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
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

  public async getTrainerFriends(query: PaginationQuery, userId: string): Promise<Pagination<UserRdo>> {
    const pagination = await this.userRepository.findFriends(query, userId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(UserRdo, entity.toPOJO())),
    };
    return paginationResult;
  }
}
