import { Expose } from 'class-transformer';

import { DefaultPagination } from '@2299899-fit-friends/consts';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRdo<T> {
  @ApiProperty({ description: 'Сущности' })
  @Expose()
  public entities: T[];

  @ApiProperty({ description: 'Количество страниц пагинации', example: 2 })
  @Expose()
  public totalPages: number;

  @ApiProperty({ description: 'Количество сущностей', example: DefaultPagination.Limit + 1 })
  @Expose()
  public totalItems: number;

  @ApiProperty({ description: 'Текущая страница', example: 1 })
  @Expose()
  public currentPage: number;

  @ApiProperty({ description: 'Количество элементов на странице', example: DefaultPagination.Limit })
  @Expose()
  public itemsPerPage: number;
}
