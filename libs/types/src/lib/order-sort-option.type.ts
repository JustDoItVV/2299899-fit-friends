import { SortOption } from './sort-option.enum';

export enum OrderSortOption {
  Amount = 'amount',
  EarnedSum = 'earnedSum',
}

export type OrderSortOptionType = SortOption | OrderSortOption ;
