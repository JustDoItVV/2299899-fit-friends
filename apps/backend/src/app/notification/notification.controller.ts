import { ApiUserMessage } from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam } from '@2299899-fit-friends/core';
import { NotificationRdo } from '@2299899-fit-friends/dtos';
import { TokenPayload } from '@2299899-fit-friends/types';
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse,
    ApiOperation, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { NotificationService } from './notification.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiTags('Оповещения')
  @ApiOperation({ summary: 'Список оповещений' })
  @ApiOkResponse({ description: 'Список оповещений', type: NotificationRdo, isArray: true })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  public async show(@UserParam() payload: TokenPayload) {
    return await this.notificationService.getUsersNotifications(payload.userId);
  }

  @ApiTags('Оповещения')
  @ApiOperation({ summary: 'Удалить оповещение' })
  @ApiNoContentResponse({ description: 'Оповещение удалено' })
  @ApiForbiddenResponse({ description: 'Удаление запрещено, уведомление не принадлежить пользователю' })
  @ApiNotFoundResponse({ description: 'Оповещение не найдено' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @UserParam() payload: TokenPayload,
  ) {
    return await this.notificationService.delete(id, payload.userId);
  }
}
