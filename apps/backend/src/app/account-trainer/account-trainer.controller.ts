import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/backend-core';
import {
    ApiAccountTrainerMessage, ApiTag, ApiTrainingMessage, ApiUserMessage
} from '@2299899-fit-friends/consts';
import {
    ApiOkResponsePaginated, OrderPaginationQuery, OrderRdo, PaginationQuery, PaginationRdo,
    TrainingPaginationQuery, TrainingRdo, UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import { Controller, Get, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiTags,
    ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { TrainingService } from '../training/training.service';
import { AccountTrainerService } from './account-trainer.service';

@ApiBearerAuth()
@ApiTags(ApiTag.AccountTrainer)
@UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.Trainer]))
@Controller('account/trainer')
export class AccountTrainerController {
  constructor(
    private readonly trainingService: TrainingService,
    private readonly accountTrainerService: AccountTrainerService
  ) {}

  @ApiOperation({ summary: 'Список тренировок Тренера' })
  @ApiOkResponsePaginated(TrainingRdo, ApiAccountTrainerMessage.Catalog)
  @ApiBadRequestResponse({ description: ApiTrainingMessage.ValidationError })
  @ApiForbiddenResponse({ description: ApiUserMessage.ForbiddenExceptTrainer })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  @UsePipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }))
  public async showTrainings(
    @UserParam() payload: TokenPayload,
    @Query() query: TrainingPaginationQuery
  ) {
    const result = await this.trainingService.getByQuery(query, payload.userId);
    return fillDto(PaginationRdo<TrainingRdo>, result);
  }

  @ApiOperation({ summary: 'Список заказов Тренера' })
  @ApiOkResponsePaginated(OrderRdo, ApiAccountTrainerMessage.Orders)
  @ApiBadRequestResponse({ description: ApiTrainingMessage.ValidationError })
  @ApiForbiddenResponse({ description: ApiUserMessage.ForbiddenExceptTrainer })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('orders')
  @UsePipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }))
  public async showOrders(
    @UserParam() payload: TokenPayload,
    @Query() query: OrderPaginationQuery
  ) {
    const result = await this.accountTrainerService.getTrainerOrdersByQuery(query, payload.userId);
    return fillDto(PaginationRdo<OrderRdo>, result);
  }

  @ApiOperation({ summary: 'Список друзей Тренера' })
  @ApiOkResponsePaginated(UserRdo, ApiAccountTrainerMessage.Friends)
  @ApiBadRequestResponse({ description: ApiTrainingMessage.ValidationError })
  @ApiForbiddenResponse({ description: ApiUserMessage.ForbiddenExceptTrainer })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('friends')
  @UsePipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }))
  public async showFriends(
    @UserParam() payload: TokenPayload,
    @Query() query: PaginationQuery
  ) {
    const result = await this.accountTrainerService.getTrainerFriends(query, payload.userId);
    return fillDto(PaginationRdo<UserRdo>, result);
  }
}
