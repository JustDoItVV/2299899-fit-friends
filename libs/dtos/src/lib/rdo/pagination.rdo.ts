import { Expose } from 'class-transformer';

export class PaginationRdo<T> {
  @Expose()
  public entities: T[];

  @Expose()
  public totalPages: number;

  @Expose()
  public totalItems: number;

  @Expose()
  public currentPage: number;

  @Expose()
  public itemsPerPage: number;
}
