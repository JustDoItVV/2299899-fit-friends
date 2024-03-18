import { CreateReviewDto, PaginationQuery, ReviewRdo } from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { Pagination } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { ReviewEntity } from './review.entity';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
  ) {}

  public async create(dto: CreateReviewDto, userId: string, trainingId: string): Promise<ReviewEntity> {
    const entity = ReviewEntity.fromDto(dto, userId);
    entity.trainingId = trainingId;
    const document = await this.reviewRepository.save(entity);
    return document;
  }

  public async getByQuery(query: PaginationQuery, trainingId: string): Promise<Pagination<ReviewRdo>> {
    const pagination = await this.reviewRepository.find(query, trainingId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(ReviewRdo, entity.toPOJO())),
    };
    return paginationResult;
  }
}
