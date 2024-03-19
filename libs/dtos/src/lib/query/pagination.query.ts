import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { DefaultPagination } from '@2299899-fit-friends/consts';
import { SortDirection, SortOption } from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQuery {
  @ApiPropertyOptional({ description: 'Ограничение количества возвращаемых элементов', type: String })
  @Transform(({ value }) => +value || DefaultPagination.Limit)
  public limit: number = DefaultPagination.Limit;

  @ApiPropertyOptional({ description: 'Поле для сортировки', type: String })
  @IsEnum(SortOption)
  @IsOptional()
  public sortOption: SortOption | unknown = SortOption.CreatedAt;

  @ApiPropertyOptional({ description: 'Направление сортировки', type: String })
  @IsEnum(SortDirection)
  @IsOptional()
  public sortDirection: SortDirection = SortDirection.Desc;

  @ApiPropertyOptional({ description: 'Страница пагинации', type: String })
  @Transform(({ value }) => +value || DefaultPagination.Page)
  public page: number = DefaultPagination.Page;
}
