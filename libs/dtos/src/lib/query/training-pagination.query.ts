import { IsEnum, IsNumber, IsOptional, ValidationArguments } from 'class-validator';

import { PriceLimit, RatingLimit, TrainingCaloriesLimit } from '@2299899-fit-friends/consts';
import { TrainingDuration, TrainingType } from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { TransformArrayInt } from '../decorators/transform-array-int.decorator';
import { PaginationQuery } from './pagination.query';

export class TrainingPaginationQuery extends PaginationQuery {
  @ApiPropertyOptional({ description: 'Фильтр по диапазону цен', type: Number, isArray: true })
  @IsNumber({}, { each: true })
  @TransformArrayInt(PriceLimit.Max)
  @IsOptional()
  public price: [number, number] = [PriceLimit.Min, PriceLimit.Max];

  @ApiPropertyOptional({ description: 'Фильтр по диапазону калорий', type: Number, isArray: true })
  @IsNumber({}, { each: true })
  @TransformArrayInt(TrainingCaloriesLimit.Max)
  @IsOptional()
  public calories: [number, number] = [TrainingCaloriesLimit.Min, TrainingCaloriesLimit.Max];

  @ApiPropertyOptional({ description: 'Фильтр по диапазону рейтингов', type: Number, isArray: true })
  @IsNumber({}, { each: true, message: (args: ValidationArguments) => {
    console.log(args.value);
    return 'dafuq';
  } })
  @TransformArrayInt(RatingLimit.Max)
  @IsOptional()
  public rating: [number, number] = [0, RatingLimit.Max];

  @ApiPropertyOptional({ description: 'Фильтр по продолжительности', enum: TrainingDuration, isArray: true })
  @IsEnum(TrainingDuration, { each: true })
  @IsOptional()
  public duration?: TrainingDuration | TrainingDuration[];

  @ApiPropertyOptional({ description: 'Фильтр по типам тренировки', isArray: true })
  @IsEnum(TrainingType, { each: true })
  @IsOptional()
  public type?: TrainingType | TrainingType[];
}
