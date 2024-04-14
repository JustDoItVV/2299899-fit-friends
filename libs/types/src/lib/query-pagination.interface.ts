import { OrderSortOption } from './order-sort-option.enum';
import { SortDirection } from './sort-direction.enum';
import { SortOption } from './sort-option.enum';

export interface QueryPagination {
  limit?: number;
  sortOption?: SortOption | OrderSortOption;
  sortDirection?: SortDirection;
  page?: number;
  [key: string]: unknown;
}
