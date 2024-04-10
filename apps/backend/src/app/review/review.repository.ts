import { BasePostgresRepository } from '@2299899-fit-friends/backend-core';
import { DefaultPagination } from '@2299899-fit-friends/consts';
import { PaginationQuery } from '@2299899-fit-friends/dtos';
import { PrismaClientService } from '@2299899-fit-friends/models';
import { Pagination, Review, SortOption } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { TrainingRepository } from '../training/training.repository';
import { ReviewEntity } from './review.entity';

@Injectable()
export class ReviewRepository extends BasePostgresRepository<
  ReviewEntity,
  Review
> {
  constructor(
    protected readonly clientService: PrismaClientService,
    private readonly trainingRepository: TrainingRepository
  ) {
    super(clientService, ReviewEntity.fromObject);
  }

  private async getReviewsCount(
    where: Prisma.ReviewWhereInput
  ): Promise<number> {
    return this.clientService.review.count({ where });
  }

  private calculatePage(totalCount: number, limit: number): number {
    if (totalCount === 0) {
      return 1;
    }

    return Math.ceil(totalCount / limit);
  }

  public async save(entity: ReviewEntity): Promise<ReviewEntity> {
    const pojoEntity = entity.toPOJO();
    const training = await this.trainingRepository.findById(
      pojoEntity.trainingId
    );

    if (!training.rating) {
      training.rating = pojoEntity.rating;
    } else {
      const reviewsCount = await this.getReviewsCount({
        trainingId: entity.trainingId,
      });
      training.rating =
        (training.rating * reviewsCount + pojoEntity.rating) /
        (reviewsCount + 1);
    }

    await this.trainingRepository.update(training.id, training);
    const document = await this.clientService.review.create({
      data: pojoEntity,
    });
    entity.id = document.id;
    return entity;
  }

  public async find(
    query: PaginationQuery,
    trainingId: string
  ): Promise<Pagination<ReviewEntity>> {
    let limit = query.limit;
    if (query.limit < 1) {
      limit = 1;
    } else if (query.limit > DefaultPagination.Limit) {
      limit = DefaultPagination.Limit;
    }

    const where: Prisma.ReviewWhereInput = {};
    where.trainingId = trainingId;

    const orderBy: Prisma.ReviewOrderByWithRelationAndSearchRelevanceInput = {};
    if (query.sortOption === SortOption.CreatedAt) {
      orderBy.createdAt = query.sortDirection;
    }

    const documentsCount = await this.getReviewsCount(where);
    const totalPages = this.calculatePage(documentsCount, limit);
    let currentPage = query.page;
    if (query.page < 1) {
      currentPage = 1;
    } else if (query.page > totalPages) {
      currentPage = totalPages;
    }

    const skip = (currentPage - 1) * limit;
    const documents = await this.clientService.review.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      entities: documents.map((review) =>
        this.createEntityFromDocument(review)
      ),
      currentPage,
      totalPages,
      itemsPerPage: limit,
      totalItems: documentsCount,
    };
  }
}
