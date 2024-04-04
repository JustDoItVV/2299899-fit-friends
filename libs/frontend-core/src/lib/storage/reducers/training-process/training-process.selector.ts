import { NameSpace, Training } from '@2299899-fit-friends/types';

import { State } from '../../types/state.type';

export const selectAccountTrainerCatalog = (state: Pick<State, NameSpace.Training>): Training[] =>
  state[NameSpace.Training].catalog;
