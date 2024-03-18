import { Expose } from 'class-transformer';

import { TrainingDuration, TrainingLevel, TrainingType } from '@2299899-fit-friends/types';

export class TrainingRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public backgroundPicture: string;

  @Expose()
  public level: TrainingLevel;

  @Expose()
  public type: TrainingType;

  @Expose()
  public duration: TrainingDuration;

  @Expose()
  public price: number;

  @Expose()
  public calories: number;

  @Expose()
  public description: string;

  @Expose()
  public gender: string;

  @Expose()
  public video: string;

  @Expose()
  public rating: number;

  @Expose()
  public userId: string;

  @Expose()
  public isSpecialOffer: boolean;

}
