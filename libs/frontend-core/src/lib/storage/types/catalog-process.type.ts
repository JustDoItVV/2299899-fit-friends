import { Order, Training, User } from '@2299899-fit-friends/types';

export type CatalogItem = User | Training | Order;

export type CatalogItems = User[] | Training[] | Order[];

export type CatalogProcess = {
  pageItems: CatalogItems;
  totalPages: number;
};
