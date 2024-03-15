import { SortOption } from './sort-option.enum';

export enum UserSortOption {
  Role = 'role',
}

export type UserSortOptionType = SortOption | UserSortOption ;
