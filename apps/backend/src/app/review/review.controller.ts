import { JwtAuthGuard, UserParam, UserRolesGuard } from '@2299899-fit-friends/core';
import {
    CreateReviewDto, PaginationQuery, PaginationRdo, ReviewRdo
} from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { TokenPayload, UserRole } from '@2299899-fit-friends/types';
import {
    Body, Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';

import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
  ) {}

  @Post(':trainingId')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @UseGuards(JwtAuthGuard, new UserRolesGuard([UserRole.User]))
  public async create(
    @Param('trainingId') trainingId: string,
    @Body() dto: CreateReviewDto,
    @UserParam() payload: TokenPayload,
  ) {
    const newReview = await this.reviewService.create(dto, payload.userId, trainingId);
    return fillDto(ReviewRdo, newReview.toPOJO());
  }

  @Get(':trainingId')
  @UsePipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
  @UseGuards(JwtAuthGuard)
  public async show(
    @Param('trainingId') trainingId: string,
    @Query() query: PaginationQuery,
  ) {
    const result = await this.reviewService.getByQuery(query, trainingId);
    return fillDto(PaginationRdo<ReviewRdo>, result);
  }
}
