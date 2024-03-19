import { Transform } from 'class-transformer';

import { OrderSortOptionType, SortOption } from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQuery } from './pagination.query';

export class OrderPaginationQuery extends PaginationQuery {
  @ApiPropertyOptional({ description: 'Поле для сортировки', type: String })
  @Transform(({ value }) => +value || SortOption.CreatedAt)
  public sortOption: OrderSortOptionType;
}
