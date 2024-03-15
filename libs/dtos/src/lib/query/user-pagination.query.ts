import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional } from 'class-validator';

import { METRO_STATIONS } from '@2299899-fit-friends/consts';
import {
    SortOption, TrainingLevel, TrainingType, UserSortOptionType
} from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQuery } from './pagination.query';

export class UserPaginationQuery extends PaginationQuery {
  @ApiPropertyOptional({ description: 'Локация, станция метро', type: String })
  @IsIn(METRO_STATIONS)
  @IsOptional()
  public location?: string;

  @ApiPropertyOptional({ description: 'Тип тренировок', type: Array<string>, minItems: 0, maxItems: 3 })
  @IsEnum(TrainingType, { each: true })
  @IsOptional()
  public specialization?: TrainingType | TrainingType[];

  @ApiPropertyOptional({ description: 'Уровень физической подготовки', type: String })
  @IsEnum(TrainingLevel)
  @IsOptional()
  public level?: TrainingLevel;

  @ApiPropertyOptional({ description: 'Поле для сортировки', type: String })
  @Transform(({ value }) => +value || SortOption.CreatedAt)
  public sortOption: UserSortOptionType;
}
