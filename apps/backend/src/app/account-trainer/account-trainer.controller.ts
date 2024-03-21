import { ApiUserMessage } from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import {
    OrderPaginationQuery, OrderRdo, PaginationQuery, PaginationRdo, TrainingPaginationQuery,
    TrainingRdo, UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import { Controller, Get, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation,
    ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { TrainingService } from '../training/training.service';
import { AccountTrainerService } from './account-trainer.service';

@ApiBearerAuth()
@ApiTags('Личный кабинет тренера')
@UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.Trainer]))
@Controller('account/trainer')
export class AccountTrainerController {
  constructor(
    private readonly trainingService: TrainingService,
    private readonly accountTrainerService: AccountTrainerService,
  ) {}

  @ApiOperation({ summary: 'Список тренировок Тренера' })
  @ApiOkResponse({ description: 'Список тренировок Тренера', type: PaginationRdo<TrainingRdo> })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiForbiddenResponse({ description: `Запрещено кроме пользователей с ролью "${UserRole.Trainer}"` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async showTrainings(
    @UserParam() payload: TokenPayload,
    @Query() query: TrainingPaginationQuery,
  ) {
    const result = await this.trainingService.getByQuery(query, payload.userId);
    return fillDto(PaginationRdo<TrainingRdo>, result);
  }

  @ApiOperation({ summary: 'Список заказов Тренера' })
  @ApiOkResponse({ description: 'Список заказов Тренера', type: PaginationRdo<OrderRdo> })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiForbiddenResponse({ description: `Запрещено кроме пользователей с ролью "${UserRole.Trainer}"` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('orders')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async showOrders(
    @UserParam() payload: TokenPayload,
    @Query() query: OrderPaginationQuery,
  ) {
    const result = await this.accountTrainerService.getTrainerOrdersByQuery(query, payload.userId);
    return fillDto(PaginationRdo<OrderRdo>, result);
  }

  @ApiOperation({ summary: 'Список друзей Тренера' })
  @ApiOkResponse({ description: 'Список друзей Тренера', type: PaginationRdo<UserRdo> })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiForbiddenResponse({ description: `Запрещено кроме пользователей с ролью "${UserRole.Trainer}"` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
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
