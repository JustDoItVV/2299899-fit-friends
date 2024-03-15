import { Expose } from 'class-transformer';

import { DefaultPagination } from '@2299899-fit-friends/consts';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRdo<T> {
  @ApiProperty()
  @Expose()
  public entities: T[];

  @ApiProperty({ example: 2 })
  @Expose()
  public totalPages: number;

  @ApiProperty({ example: DefaultPagination.Limit + 1 })
  @Expose()
  public totalItems: number;

  @ApiProperty({ example: 1 })
  @Expose()
  public currentPage: number;

  @ApiProperty({ example: DefaultPagination.Limit })
  @Expose()
  public itemsPerPage: number;
}
