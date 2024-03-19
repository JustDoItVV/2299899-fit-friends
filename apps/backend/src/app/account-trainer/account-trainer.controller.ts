import { ApiUserMessage } from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import {
    OrderPaginationQuery, OrderRdo, PaginationQuery, PaginationRdo, TrainingPaginationQuery,
    TrainingRdo, UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import {
    Controller, Get, HttpStatus, Query, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { TrainingService } from '../training/training.service';
import { AccountTrainerService } from './account-trainer.service';

@ApiBearerAuth()
@ApiTags('Account/Trainer')
@Controller('account/trainer')
@UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.Trainer]))
export class AccountTrainerController {
  constructor(
    private readonly trainingService: TrainingService,
    private readonly accountTrainerService: AccountTrainerService,
  ) {}

  @ApiResponse({ status: HttpStatus.OK, type: PaginationRdo<TrainingRdo> })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Get('')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async showTrainings(
    @UserParam() payload: TokenPayload,
    @Query() query: TrainingPaginationQuery,
  ) {
    const result = await this.trainingService.getByQuery(query, payload.userId);
    return fillDto(PaginationRdo<TrainingRdo>, result);
  }

  @ApiResponse({ status: HttpStatus.OK, type: PaginationRdo<OrderRdo> })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @Get('orders')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async showOrders(
    @UserParam() payload: TokenPayload,
    @Query() query: OrderPaginationQuery,
  ) {
    const result = await this.accountTrainerService.getTrainerOrdersByQuery(query, payload.userId);
    return fillDto(PaginationRdo<OrderRdo>, result);
  }

  @ApiResponse({ status: HttpStatus.OK, type: PaginationRdo<UserRdo> })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: ApiUserMessage.Unauthorized })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
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
