import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';

import { PriceLimit, RatingLimit, TrainingCaloriesLimit } from '@2299899-fit-friends/consts';
import {
    SortOption, TrainingDuration, TrainingSortOption, TrainingType
} from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQuery } from './pagination.query';

export class TrainingPaginationQuery extends PaginationQuery {
  @ApiPropertyOptional({ description: 'Фильтр по минимальной цене', type: Number })
  @IsNumber()
  @IsOptional()
  public priceMin: number = PriceLimit.Min;

  @ApiPropertyOptional({ description: 'Фильтр по максимальной цене', type: Number })
  @IsNumber()
  @IsOptional()
  public priceMax: number = PriceLimit.Max;

  @ApiPropertyOptional({ description: 'Фильтр по минимальным калориям', type: Number })
  @IsNumber()
  @IsOptional()
  public caloriesMin: number = TrainingCaloriesLimit.Min;

  @ApiPropertyOptional({ description: 'Фильтр по максимальным калориям', type: Number })
  @IsNumber()
  @IsOptional()
  public caloriesMax: number = TrainingCaloriesLimit.Max;

  @ApiPropertyOptional({ description: 'Фильтр по минимальному рейтингу', type: Number })
  @IsNumber()
  @IsOptional()
  public ratingMin: number = RatingLimit.Min - 1;

  @ApiPropertyOptional({ description: 'Фильтр по максимальному рейтингу', type: Number })
  @IsNumber()
  @IsOptional()
  public ratingMax: number = RatingLimit.Max;

  @ApiPropertyOptional({ description: 'Фильтр по продолжительности', enum: TrainingDuration, isArray: true })
  @IsEnum(TrainingDuration, { each: true })
  @IsOptional()
  public duration?: TrainingDuration | TrainingDuration[];

  @ApiPropertyOptional({ description: 'Фильтр по типам тренировки', isArray: true })
  @IsEnum(TrainingType, { each: true })
  @IsOptional()
  public type?: TrainingType | TrainingType[];

  @ApiPropertyOptional({ description: 'Фильтр по специальным предложениям' })
  @IsBoolean()
  @IsOptional()
  public isSpecialOffer?: boolean;

  @ApiPropertyOptional({ description: 'Поле для сортировки', type: String })
  @IsEnum(TrainingSortOption)
  @Transform(({ value }) => value ? value : SortOption.CreatedAt)
  public sortOption: TrainingSortOption;
}
