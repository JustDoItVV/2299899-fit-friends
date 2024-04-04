import { SortDirection } from './sort-direction.enum';
import { SortOption } from './sort-option.enum';

export interface QueryPagination {
  limit?: number;
  sortOption?: SortOption;
  sortDirection?: SortDirection;
  page?: number;
  [key: string]: unknown;
}
