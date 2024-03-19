import { IsEnum, IsOptional } from 'class-validator';

import {
    PriceLimit, RatingLimit, TrainingCaloriesLimit, TrainingErrorMessage
} from '@2299899-fit-friends/consts';
import { TransformToInt } from '@2299899-fit-friends/core';
import { TrainingDuration, TrainingType } from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQuery } from './pagination.query';

export class TrainingPaginationQuery extends PaginationQuery {
  @ApiPropertyOptional({ description: 'Фильтр по диапазону цен', type: Array })
  @TransformToInt(TrainingErrorMessage.Nan)
  public price: [number, number] = [PriceLimit.Min, PriceLimit.Max];

  @ApiPropertyOptional({ description: 'Фильтр по диапазону калорий', type: Array })
  @TransformToInt(TrainingErrorMessage.Nan)
  public calories: [number, number] = [TrainingCaloriesLimit.Min, TrainingCaloriesLimit.Max];

  @ApiPropertyOptional({ description: 'Фильтр по диапазону рейтингов', type: Array })
  @TransformToInt(TrainingErrorMessage.Nan)
  public rating: [number, number] = [0, RatingLimit.Max];

  @ApiPropertyOptional({ description: 'Фильтр по продолжительности', type: Array })
  @IsEnum(TrainingDuration, { each: true })
  @IsOptional()
  public duration?: TrainingDuration | TrainingDuration[];

  @ApiPropertyOptional({ description: 'Фильтр по типам тренировки', type: Array })
  @IsEnum(TrainingType, { each: true })
  @IsOptional()
  public type?: TrainingType | TrainingType[];
}
