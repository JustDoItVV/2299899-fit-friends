import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import {
    OrderPaginationQuery, OrderRdo, PaginationQuery, PaginationRdo, TrainingPaginationQuery,
    TrainingRdo, UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import { Controller, Get, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TrainingService } from '../training/training.service';
import { AccountTrainerService } from './account-trainer.service';

@ApiTags('Account/Trainer')
@Controller('account/trainer')
@UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.Trainer]))
export class AccountTrainerController {
  constructor(
    private readonly trainingService: TrainingService,
    private readonly accountTrainerService: AccountTrainerService,
  ) {}

  @Get('')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async showTrainings(
    @UserParam() payload: TokenPayload,
    @Query() query: TrainingPaginationQuery,
  ) {
    const result = await this.trainingService.getByQuery(query, payload.userId);
    return fillDto(PaginationRdo<TrainingRdo>, result);
  }

  @Get('orders')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async showOrders(
    @UserParam() payload: TokenPayload,
    @Query() query: OrderPaginationQuery,
  ) {
    const result = await this.accountTrainerService.getTrainerOrdersByQuery(query, payload.userId);
    return fillDto(PaginationRdo<OrderRdo>, result);
  }

  @Get('friends')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async showFriends(
    @UserParam() payload: TokenPayload,
    @Query() query: PaginationQuery,
  ) {
    const result = await this.accountTrainerService.getTrainerFriends(query, payload.userId);
    return fillDto(PaginationRdo<UserRdo>, result);
  }
}
