import {
  ApiReviewMessage,
  ApiTag,
  ApiTrainingMessage,
  ApiUserMessage,
} from '@2299899-fit-friends/consts';
import {
  JwtAuthGuard,
  UserParam,
  UserRolesGuard,
} from '@2299899-fit-friends/backend-core';
import {
  ApiOkResponsePaginated,
  CreateReviewDto,
  PaginationQuery,
  PaginationRdo,
  ReviewRdo,
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ReviewService } from './review.service';

@ApiBearerAuth()
@ApiTags(ApiTag.Reviews)
@UseGuards(JwtAuthGuard)
@Controller('training/:id/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Создание отзыва к тренировке' })
  @ApiCreatedResponse({
    description: ApiReviewMessage.CreateSuccess,
    type: ReviewRdo,
  })
  @ApiNotFoundResponse({ description: ApiTrainingMessage.NotFound })
  @ApiBadRequestResponse({ description: ApiTrainingMessage.ValidationError })
  @ApiForbiddenResponse({ description: ApiUserMessage.ForbiddenExceptUser })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Post('')
  @UseGuards(new UserRolesGuard([UserRole.User]))
  public async create(
    @Param('id') trainingId: string,
    @Body() dto: CreateReviewDto,
    @UserParam() payload: TokenPayload
  ) {
    const newReview = await this.reviewService.create(
      dto,
      payload.userId,
      trainingId
    );
    return fillDto(ReviewRdo, newReview.toPOJO());
  }

  @ApiOperation({ summary: 'Список отзывов к тренировке' })
  @ApiOkResponsePaginated(ReviewRdo, ApiReviewMessage.List)
  @ApiBadRequestResponse({ description: ApiTrainingMessage.ValidationError })
  @ApiUnauthorizedResponse({ description: ApiUserMessage.Unauthorized })
  @Get('')
  public async show(
    @Param('id') trainingId: string,
    @Query() query: PaginationQuery
  ) {
    const result = await this.reviewService.getByQuery(query, trainingId);
    return fillDto(PaginationRdo<ReviewRdo>, result);
  }
}
