import { ApiUserMessage } from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import {
    CreateTrainingRequestDto, PaginationQuery, PaginationRdo, TrainingRequestRdo,
    UpdateTrainingRequestDto
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import {
    Body, Controller, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
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
    private readonly trainingRequestService: TrainingRequestService,
  ) {}

  @ApiOperation({ summary: 'Создание заявки на персональную/совместную тренировку' })
  @ApiCreatedResponse({ description: 'Заявка успешно создана', type: TrainingRequestRdo })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiForbiddenResponse({ description: `Запрещено кроме пользователей с ролью "${UserRole.User}"` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('')
  @UseGuards(new UserRolesGuard([UserRole.User]))
  public async create(
    @Body() dto: CreateTrainingRequestDto,
    @UserParam() payload: TokenPayload,
  ) {
    const newRequest = await this.trainingRequestService.create(dto, payload.userId);
    return fillDto(TrainingRequestRdo, newRequest.toPOJO());
  }

  @ApiOperation({ summary: 'Список запросов на тренировки' })
  @ApiOkResponse({ description: 'Список запросов на тренировки', type: PaginationRdo<TrainingRequestRdo> })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async show(
    @Query() query: PaginationQuery,
    @UserParam() payload: TokenPayload,
  ) {
    const result = await this.trainingRequestService.getByQuery(query, payload.userId);
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
    @UserParam() payload: TokenPayload,
  ) {
    const updatedRequest = await this.trainingRequestService.update(id, dto, payload.userId);
    return fillDto(TrainingRequestRdo, updatedRequest.toPOJO());
  }
}
