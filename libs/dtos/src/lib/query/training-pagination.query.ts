import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { PriceLimit, RatingLimit, TrainingCaloriesLimit } from '@2299899-fit-friends/consts';
import { TrainingDuration, TrainingType } from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQuery } from './pagination.query';

export class TrainingPaginationQuery extends PaginationQuery {
  @ApiPropertyOptional({ description: 'Фильтр по диапазону цен', type: Array })
  @IsNumber()
  public price: [number, number] = [PriceLimit.Min, PriceLimit.Max];

  @ApiPropertyOptional({ description: 'Фильтр по диапазону калорий', type: Array })
  @IsNumber()
  public calories: [number, number] = [TrainingCaloriesLimit.Min, TrainingCaloriesLimit.Max];

  @ApiPropertyOptional({ description: 'Фильтр по диапазону рейтингов', type: Array })
  @IsNumber()
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
