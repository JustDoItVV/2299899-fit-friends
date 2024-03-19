import { CreateReviewDto } from '@2299899-fit-friends/dtos';
import { BaseEntity, Review } from '@2299899-fit-friends/types';

export class ReviewEntity implements Review, BaseEntity<string, Review> {
  public id?: string | undefined;
  public userId: string;
  public trainingId: string;
  public rating: number;
  public text: string;

  public populate(data: Review): ReviewEntity {
    this.id = data.id ?? undefined;
    this.userId = data.userId;
    this.trainingId = data.trainingId;
    this.rating = data.rating;
    this.text = data.text;

    return this;
  }

  public toPOJO(): Review {
    return {
      id: this.id,
      userId: this.userId,
      trainingId: this.trainingId,
      rating: this.rating,
      text: this.text,
    };
  }

  static fromObject(data: Review): ReviewEntity {
    return new ReviewEntity().populate(data);
  }

  static fromDto(dto: CreateReviewDto, userId: string): ReviewEntity {
    const entity = new ReviewEntity();

      entity.userId = userId;
      entity.rating = dto.rating;
      entity.text = dto.text;

      return entity;
  }
}
