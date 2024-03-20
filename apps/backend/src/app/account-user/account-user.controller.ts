import { ApiUserMessage } from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import { PaginationQuery, PaginationRdo, UserRdo } from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import { Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation,
    ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { AccountUserService } from './account-user.service';

@ApiBearerAuth()
@ApiTags('Личный кабинет пользователя')
@UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.User]))
@Controller('account/user')
export class AccountUserController {
  constructor(
    private readonly accountUserService: AccountUserService,
  ) {}

  @ApiOperation({ summary: 'Список друзей Пользователя' })
  @ApiOkResponse({ description: 'Список друзей Пользователя', type: PaginationRdo<UserRdo> })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiForbiddenResponse({ description: `Запрещено кроме пользователей с ролью "${UserRole.User}"` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('friends')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  public async showFriends(
    @UserParam() payload: TokenPayload,
    @Query() query: PaginationQuery,
  ) {
    const result = await this.accountUserService.getUserFriends(query, payload.userId);
    return fillDto(PaginationRdo<UserRdo>, result);
  }

  @ApiOperation({ summary: 'Запустить рассылку уведомлений по email о новых тренировках в подписках' })
  @ApiOkResponse({ description: 'Рассылка уведомлений по email успешно запущена' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('send-new-trainings-mail')
  public async sendNewTrainingsMailNotifications(@UserParam() payload: TokenPayload) {
    return await this.accountUserService.sendNewTrainingsMailNotifications(payload.userId);
  }
}
