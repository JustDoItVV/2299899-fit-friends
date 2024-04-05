import { NameSpace } from '@2299899-fit-friends/types';

import { CatalogItems } from '../../types/catalog-process.type';
import { State } from '../../types/state.type';

export const selectCatalogPageItems = (state: Pick<State, NameSpace.Catalog>): CatalogItems =>
  state[NameSpace.Catalog].pageItems;
export const selectCatalogTotalPages = (state: Pick<State, NameSpace.Catalog>): number =>
  state[NameSpace.Catalog].totalPages;
export const selectCatalogTotalItems = (state: Pick<State, NameSpace.Catalog>): number =>
  state[NameSpace.Catalog].totalItems;
