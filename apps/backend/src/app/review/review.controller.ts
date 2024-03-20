import { ApiUserMessage } from '@2299899-fit-friends/consts';
import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import {
    CreateReviewDto, PaginationQuery, PaginationRdo, ReviewRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import {
    Body, Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse,
    ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { ReviewService } from './review.service';

@ApiBearerAuth()
@ApiTags('Reviews')
@Controller('training/:id/reviews')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
  ) {}

  @ApiOperation({ summary: 'Создание отзыва к тренировке' })
  @ApiCreatedResponse({ description: 'Отзыв создан', type: ReviewRdo })
  @ApiNotFoundResponse({ description: 'Тренировка не найдена' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiForbiddenResponse({ description: `Создание запрещено кроме пользователя с ролью ${UserRole.User}` })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.User]))
  public async create(
    @Param('id') trainingId: string,
    @Body() dto: CreateReviewDto,
    @UserParam() payload: TokenPayload,
  ) {
    const newReview = await this.reviewService.create(dto, payload.userId, trainingId);
    return fillDto(ReviewRdo, newReview.toPOJO());
  }

  @ApiOperation({ summary: 'Список отзывов к тренировке' })
  @ApiOkResponse({ description: 'Список отзывов к тренировке', type: PaginationRdo<ReviewRdo> })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @UseGuards(JwtAuthGuard)
  public async show(
    @Param('id') trainingId: string,
    @Query() query: PaginationQuery,
  ) {
    const result = await this.reviewService.getByQuery(query, trainingId);
    return fillDto(PaginationRdo<ReviewRdo>, result);
  }
}
