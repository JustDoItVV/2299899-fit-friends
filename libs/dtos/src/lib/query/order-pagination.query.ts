import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { OrderSortOption, SortOption } from '@2299899-fit-friends/types';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQuery } from './pagination.query';

export class OrderPaginationQuery extends PaginationQuery {
  @ApiPropertyOptional({ description: 'Поле для сортировки', type: String })
  @IsEnum(OrderSortOption)
  @Transform(({ value }) => value ? value : SortOption.CreatedAt)
  public sortOption: OrderSortOption;
}
