import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/backend-core';
import { ApiUserMessage } from '@2299899-fit-friends/consts';
import {
    CreateTrainingRequestDto, PaginationRdo, TrainingRequestRdo, TrainingRequestsPaginationQuery,
    UpdateTrainingRequestDto
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse,
    ApiOperation, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { TrainingRequestService } from './training-request.service';

@ApiBearerAuth()
@ApiTags('Персональные тренировки/совместные тренировки')
@UseGuards(JwtAuthGuard)
@Controller('training-request')
export class TrainingRequestController {
  constructor(
    private readonly trainingRequestService: TrainingRequestService
  ) {}

  @ApiOperation({
    summary: 'Создание заявки на персональную/совместную тренировку',
  })
  @ApiCreatedResponse({
    description: 'Заявка успешно создана',
    type: TrainingRequestRdo,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiForbiddenResponse({
    description: `Запрещено кроме пользователей с ролью "${UserRole.User}"`,
  })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('')
  @UseGuards(new UserRolesGuard([UserRole.User]))
  public async create(
    @Body() dto: CreateTrainingRequestDto,
    @UserParam() payload: TokenPayload
  ) {
    const newRequest = await this.trainingRequestService.create(
      dto,
      payload.userId
    );
    return fillDto(TrainingRequestRdo, newRequest.toPOJO());
  }

  @ApiOperation({ summary: 'Список запросов на тренировки для текущего пользователя' })
  @ApiOkResponse({
    description: 'Список запросов на тренировки для текущего пользователя',
    type: PaginationRdo<TrainingRequestRdo>,
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  public async show(
    @Query() query: TrainingRequestsPaginationQuery,
  ) {
    const result = await this.trainingRequestService.getByQuery(query);
    return fillDto(PaginationRdo<TrainingRequestRdo>, result);
  }

  @ApiOperation({ summary: 'Изменение статуса заявки' })
  @ApiOkResponse({ description: 'Статус заявки успешно обновлен' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateTrainingRequestDto,
    @UserParam() payload: TokenPayload
  ) {
    const updatedRequest = await this.trainingRequestService.update(
      id,
      dto,
      payload.userId
    );
    return fillDto(TrainingRequestRdo, updatedRequest.toPOJO());
  }
}
