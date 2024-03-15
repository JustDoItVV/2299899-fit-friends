import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { DefaultPagination } from '@2299899-fit-friends/consts';
import { SortDirection, SortOption } from '@2299899-fit-friends/types';

export class PaginationQuery {
  @Transform(({ value }) => +value || DefaultPagination.Limit)
  public limit: number = DefaultPagination.Limit;

  @IsEnum(SortOption)
  @IsOptional()
  public sortOption: SortOption | unknown = SortOption.CreatedAt;

  @IsEnum(SortDirection)
  @IsOptional()
  public sortDirection: SortDirection = SortDirection.Desc;

  @Transform(({ value }) => +value || DefaultPagination.Page)
  public page: number = DefaultPagination.Page;
}
