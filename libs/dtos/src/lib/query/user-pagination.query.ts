import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsOptional } from 'class-validator';

import { METRO_STATIONS } from '@2299899-fit-friends/consts';
import {
    SortOption, TrainingLevel, TrainingType, UserSortOptionType
} from '@2299899-fit-friends/types';

import { PaginationQuery } from './pagination.query';

export class UserPaginationQuery extends PaginationQuery {
  @IsIn(METRO_STATIONS)
  @IsOptional()
  public location?: string;

  @IsEnum(TrainingType, { each: true })
  @IsOptional()
  public specialization?: TrainingType | TrainingType[];

  @IsEnum(TrainingLevel)
  @IsOptional()
  public level?: TrainingLevel;

  @Transform(({ value }) => +value || SortOption.CreatedAt)
  public sortOption: UserSortOptionType;
}
