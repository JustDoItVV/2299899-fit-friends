import {
  ApiNotificationMessage,
  ApiTag,
  ApiUserMessage,
} from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam } from '@2299899-fit-friends/backend-core';
import { NotificationRdo } from '@2299899-fit-friends/dtos';
import { TokenPayload } from '@2299899-fit-friends/types';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags(ApiTag.Notifications)
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Список оповещений' })
  @ApiOkResponse({
    description: ApiNotificationMessage.List,
    type: NotificationRdo,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  public async show(@UserParam() payload: TokenPayload) {
    return await this.notificationService.getUsersNotifications(payload.userId);
  }

  @ApiOperation({ summary: 'Удалить оповещение' })
  @ApiNoContentResponse({ description: ApiNotificationMessage.DeleteSuccess })
  @ApiForbiddenResponse({ description: ApiNotificationMessage.DeleteForbidden })
  @ApiNotFoundResponse({ description: ApiNotificationMessage.NotFound })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @UserParam() payload: TokenPayload
  ) {
    return await this.notificationService.delete(id, payload.userId);
  }
}
