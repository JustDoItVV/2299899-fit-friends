import { ApiUserMessage } from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import { CreateTrainingRequestDto, TrainingRequestRdo } from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation,
    ApiTags, ApiUnauthorizedResponse
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
}
