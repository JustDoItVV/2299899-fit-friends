import { PaginationQuery, UserRdo } from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { Pagination } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '../user/user.repository';

@Injectable()
export class AccountUserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  public async getUserFriends(query: PaginationQuery, userId: string): Promise<Pagination<UserRdo>> {
    const pagination = await this.userRepository.findFriends(query, userId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(UserRdo, entity.toPOJO())),
    };
    return paginationResult;
  }
}
