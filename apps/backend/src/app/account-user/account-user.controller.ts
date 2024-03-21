import { ApiUserMessage } from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import {
    BalanceRdo, PaginationQuery, PaginationRdo, UpdateBalanceDto, UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import {
    Body, Controller, Get, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse,
    ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse
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

  @ApiOperation({ summary: 'Баланс пользователя' })
  @ApiOkResponse({ description: 'Баланс пользователя', type: PaginationRdo<BalanceRdo> })
  @ApiForbiddenResponse({ description: `Запрещено кроме пользователей с ролью "${UserRole.User}"` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @Get('balance')
  public async showBalance(
    @UserParam() payload: TokenPayload,
    @Query() query: PaginationQuery,
  ) {
    const result = await this.accountUserService.getBalance(query, payload.userId);
    return fillDto(PaginationRdo<BalanceRdo>, result)
  }

  @ApiOperation({ summary: 'Обновление баланса пользователя' })
  @ApiCreatedResponse({ description: 'Баланс записи успешно обновлен', type: BalanceRdo })
  @ApiNotFoundResponse({ description: 'Тренировка не найдена' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiForbiddenResponse({ description: `Запрещено кроме пользователей с ролью "${UserRole.User}"` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @Patch('balance')
  public async updateBalance(
    @Body() dto: UpdateBalanceDto,
    @UserParam() payload: TokenPayload,
  ) {
    console.log(dto);
    const updatedDocument = await this.accountUserService.updateBalanceRecord(dto, payload.userId);
    return fillDto(BalanceRdo, updatedDocument.toPOJO());
  }

  @ApiOperation({ summary: 'Запустить рассылку уведомлений по email о новых тренировках в подписках' })
  @ApiOkResponse({ description: 'Рассылка уведомлений по email успешно запущена' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('send-new-trainings-mail')
  public async sendNewTrainingsMailNotifications(@UserParam() payload: TokenPayload) {
    return await this.accountUserService.sendNewTrainingsMailNotifications(payload.userId);
  }
}
