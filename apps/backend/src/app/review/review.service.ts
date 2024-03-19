import { TrainingErrorMessage } from '@2299899-fit-friends/consts';
import { CreateReviewDto, PaginationQuery, ReviewRdo } from '@2299899-fit-friends/dtos';
import { fillDto } from '@2299899-fit-friends/helpers';
import { Pagination } from '@2299899-fit-friends/types';
import { Injectable, NotFoundException } from '@nestjs/common';

import { TrainingRepository } from '../training/training.repository';
import { ReviewEntity } from './review.entity';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly trainingRepository: TrainingRepository,
  ) {}

  public async create(dto: CreateReviewDto, userId: string, trainingId: string): Promise<ReviewEntity> {
    const training = await this.trainingRepository.findById(trainingId);

    if (!training) {
      throw new NotFoundException(TrainingErrorMessage.NotFound);
    }

    const entity = ReviewEntity.fromDto(dto, userId);
    entity.trainingId = trainingId;
    const document = await this.reviewRepository.save(entity);
    return document;
  }

  public async getByQuery(query: PaginationQuery, trainingId: string): Promise<Pagination<ReviewRdo>> {
    const training = await this.trainingRepository.findById(trainingId);

    if (!training) {
      throw new NotFoundException(TrainingErrorMessage.NotFound);
    }

    const pagination = await this.reviewRepository.find(query, trainingId);
    const paginationResult = {
      ...pagination,
      entities: pagination.entities.map((entity) => fillDto(ReviewRdo, entity.toPOJO())),
    };
    return paginationResult;
  }
}
