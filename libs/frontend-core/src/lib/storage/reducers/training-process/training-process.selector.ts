import { NameSpace } from '@2299899-fit-friends/types';

import { State } from '../../types/state.type';

export const selectAccountTrainerPageItems = (state: Pick<State, NameSpace.Training>): number =>
  state[NameSpace.Training].totalPages;
