import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import {
    OrderPaginationQuery, OrderRdo, PaginationRdo, TrainingPaginationQuery, TrainingRdo
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
  public async showMyTrainings(
    @UserParam() payload: TokenPayload,
    @Query() query: TrainingPaginationQuery,
  ) {
    const result = await this.trainingService.getByQuery(query, payload.userId);
    return fillDto(PaginationRdo<TrainingRdo>, result);
  }

  @Get('orders')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async showMyOrders(
    @UserParam() payload: TokenPayload,
    @Query() query: OrderPaginationQuery,
  ) {
    const result = await this.accountTrainerService.getTrainerOrdersByQuery(query, payload.userId);
    return fillDto(PaginationRdo<OrderRdo>, result);
  }
}
