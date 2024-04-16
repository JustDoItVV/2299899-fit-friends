import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/backend-core';
import { ApiAccountUserMessage, ApiTag, ApiUserMessage } from '@2299899-fit-friends/consts';
import {
    ApiOkResponsePaginated, BalancePaginationQuery, BalanceRdo, PaginationQuery, PaginationRdo,
    UpdateBalanceDto, UserRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import {
    Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, UseGuards
} from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation,
    ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { AccountUserService } from './account-user.service';

@ApiBearerAuth()
@ApiTags(ApiTag.AccountUser)
@UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.User]))
@Controller('account/user')
export class AccountUserController {
  constructor(private readonly accountUserService: AccountUserService) {}

  @ApiOperation({ summary: 'Список друзей Пользователя' })
  @ApiOkResponsePaginated(UserRdo, ApiAccountUserMessage.FriendsList)
  @ApiBadRequestResponse({ description: ApiUserMessage.ValidationError })
  @ApiForbiddenResponse({ description: ApiUserMessage.ForbiddenExceptUser })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('friends')
  public async showFriends(
    @UserParam() payload: TokenPayload,
    @Query() query: PaginationQuery
  ) {
    const result = await this.accountUserService.getUserFriends(query, payload.userId);
    return fillDto(PaginationRdo<UserRdo>, result);
  }

  @ApiOperation({ summary: 'Баланс пользователя' })
  @ApiOkResponsePaginated(BalanceRdo, ApiAccountUserMessage.Balance)
  @ApiForbiddenResponse({ description: ApiUserMessage.ForbiddenExceptUser })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('balance')
  public async showBalance(
    @UserParam() payload: TokenPayload,
    @Query() query: BalancePaginationQuery
  ) {
    const result = await this.accountUserService.getBalance(query, payload.userId);
    return fillDto(PaginationRdo<BalanceRdo>, result);
  }

  @ApiOperation({ summary: 'Обновление баланса пользователя' })
  @ApiOkResponse({ description: ApiAccountUserMessage.BalanceUpdateSuccess, type: BalanceRdo })
  @ApiBadRequestResponse({ description: ApiUserMessage.ValidationError })
  @ApiForbiddenResponse({ description: ApiUserMessage.ForbiddenExceptUser })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Patch('balance')
  public async updateBalance(
    @Body() dto: UpdateBalanceDto,
    @UserParam() payload: TokenPayload
  ) {
    const updatedDocument = await this.accountUserService.updateBalanceRecord(dto, payload.userId);
    return fillDto(BalanceRdo, updatedDocument.toPOJO());
  }

  @ApiOperation({ summary: 'Запустить рассылку уведомлений по email о новых тренировках в подписках' })
  @ApiOkResponse({ description: ApiAccountUserMessage.SendNews })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @HttpCode(HttpStatus.OK)
  @Post('send-new-trainings-mail')
  public async sendNewTrainingsMailNotifications(
    @UserParam() payload: TokenPayload
  ) {
    return await this.accountUserService.sendNewTrainingsMailNotifications(payload.userId);
  }
}
