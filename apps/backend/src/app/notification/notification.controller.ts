import { ApiUserMessage } from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam } from '@2299899-fit-friends/core';
import { NotificationRdo } from '@2299899-fit-friends/dtos';
import { TokenPayload } from '@2299899-fit-friends/types';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags('Оповещения')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Список оповещений' })
  @ApiOkResponse({ description: 'Список оповещений', type: NotificationRdo, isArray: true })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  @UseGuards(JwtAuthGuard)
  public async show(@UserParam() payload: TokenPayload) {
    return await this.notificationService.getUsersNotifications(payload.userId);
  }
}
