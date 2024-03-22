import { CreateTrainingRequestDto } from '@2299899-fit-friends/dtos';
import { BaseEntity, TrainingRequest, TrainingRequestStatus } from '@2299899-fit-friends/types';

export class TrainingRequestEntity implements TrainingRequest, BaseEntity<string, TrainingRequest> {
  public id?: string;
  public authorId: string;
  public targetId: string;
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  public populate(data: TrainingRequest): TrainingRequestEntity {
    this.id = data.id ?? undefined;
    this.authorId = data.authorId;
    this.targetId = data.targetId;
    this.status = data.status;
    this.createdAt = data.createdAt ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;

    return this;
  }

  public toPOJO(): TrainingRequest {
    return {
      id: this.id,
      authorId: this.authorId,
      targetId: this.targetId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromObject(data: TrainingRequest): TrainingRequestEntity {
    const entity = new TrainingRequestEntity();
    entity.populate(data);
    return entity;
  }

  static fromDto(dto: CreateTrainingRequestDto, authorId: string): TrainingRequestEntity {
    const entity = new TrainingRequestEntity();
    entity.authorId = authorId;
    entity.targetId = dto.targetId;
    entity.status = TrainingRequestStatus.Consideration;

    return entity;
  }
}
