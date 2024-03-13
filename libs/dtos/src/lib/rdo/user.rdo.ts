import { Expose } from 'class-transformer';

import {
    TrainingDuration, TrainingLevel, TrainingType, UserGender, UserRole
} from '@2299899-fit-friends/types';

export class UserRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public gender: UserGender;

  @Expose()
  public birthdate?: Date;

  @Expose()
  public role: UserRole;

  @Expose()
  public description?: string;

  @Expose()
  public location: string;

  @Expose()
  public trainingLevel: TrainingLevel;

  @Expose()
  public trainingType: TrainingType[];

  @Expose()
  public trainingDuration?: TrainingDuration;

  @Expose()
  public caloriesTarget?: number;

  @Expose()
  public caloriesPerDay?: number;

  @Expose()
  public isReadyToTraining?: boolean;

  @Expose()
  public merits?: string;

  @Expose()
  public isReadyToPersonal?: boolean;

}
