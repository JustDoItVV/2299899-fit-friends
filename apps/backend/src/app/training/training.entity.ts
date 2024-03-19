import { TRAINING_DEFAULT_RATING } from '@2299899-fit-friends/consts';
import { CreateTrainingDto } from '@2299899-fit-friends/dtos';
import {
    BaseEntity, Training, TrainingAuditory, TrainingDuration, TrainingLevel, TrainingType
} from '@2299899-fit-friends/types';

export class TrainingEntity implements Training, BaseEntity<string, Training> {
  public id?: string | undefined;
  public title: string;
  public backgroundPicture: string;
  public level: TrainingLevel;
  public type: TrainingType;
  public duration: TrainingDuration;
  public price: number;
  public calories: number;
  public description: string;
  public gender: TrainingAuditory;
  public video: string;
  public rating = TRAINING_DEFAULT_RATING;
  public userId: string;
  public isSpecialOffer: boolean;

  public populate(data: Training): TrainingEntity {
    this.id = data.id ?? undefined;
    this.title = data.title;
    this.backgroundPicture = data.backgroundPicture;
    this.level = data.level;
    this.type = data.type;
    this.duration = data.duration;
    this.price = data.price;
    this.calories = data.calories;
    this.description = data.description;
    this.gender = data.gender;
    this.video = data.video;
    this.rating = data.rating;
    this.userId = data.userId;
    this.isSpecialOffer = data.isSpecialOffer;

    return this;
  }

  public toPOJO(): Training {
    return {
      id: this.id,
      title: this.title,
      backgroundPicture: this.backgroundPicture,
      level: this.level,
      type: this.type,
      duration: this.duration,
      price: this.price,
      calories: this.calories,
      description: this.description,
      gender: this.gender,
      video: this.video,
      rating: this.rating,
      userId: this.userId,
      isSpecialOffer: this.isSpecialOffer,
    };
  }

  static fromObject(data: Training): TrainingEntity {
    return new TrainingEntity().populate(data);
  }

  static fromDto(dto: CreateTrainingDto, userId: string): TrainingEntity {
    const entity = new TrainingEntity();

      entity.title = dto.title;
      entity.level = dto.level;
      entity.type = dto.type;
      entity.duration = dto.duration;
      entity.price = dto.price;
      entity.calories = dto.calories;
      entity.description = dto.description;
      entity.gender = dto.gender;
      entity.userId = userId;
      entity.isSpecialOffer = dto.isSpecialOffer;

      return entity;
  }
}
