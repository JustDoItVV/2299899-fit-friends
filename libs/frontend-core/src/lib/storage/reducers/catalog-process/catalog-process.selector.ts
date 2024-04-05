import { NameSpace } from '@2299899-fit-friends/types';

import { CatalogItems } from '../../types/catalog-items.type';
import { State } from '../../types/state.type';

export const selectCatalogTotalPages = (state: Pick<State, NameSpace.Catalog>): number =>
  state[NameSpace.Catalog].totalPages;
export const selectCatalogPageItems = (state: Pick<State, NameSpace.Catalog>): CatalogItems =>
  state[NameSpace.Catalog].pageItems;
