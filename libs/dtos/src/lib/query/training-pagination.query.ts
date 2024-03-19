import { IsEnum, IsOptional } from 'class-validator';

import {
    PriceLimit, TrainingCaloriesLimit, TrainingErrorMessage
} from '@2299899-fit-friends/consts';
import { TransformToInt } from '@2299899-fit-friends/core';
import { TrainingDuration, TrainingType } from '@2299899-fit-friends/types';

import { PaginationQuery } from './pagination.query';

export class TrainingPaginationQuery extends PaginationQuery {
  @TransformToInt(TrainingErrorMessage.Nan)
  public price: [number, number] = [PriceLimit.Min, PriceLimit.Max];

  @TransformToInt(TrainingErrorMessage.Nan)
  public calories: [number, number] = [TrainingCaloriesLimit.Min, TrainingCaloriesLimit.Max];

  @TransformToInt(TrainingErrorMessage.Nan)
  public rating = 0;

  @IsEnum(TrainingDuration, { each: true })
  @IsOptional()
  public duration?: TrainingDuration | TrainingDuration[];

  @IsEnum(TrainingType, { each: true })
  @IsOptional()
  public type?: TrainingType | TrainingType[];
}
