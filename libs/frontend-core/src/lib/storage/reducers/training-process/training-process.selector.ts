import { Balance, NameSpace, Review, Training } from '@2299899-fit-friends/types';

import { State } from '../../types/state.type';

export const selectTraining = (state: Pick<State, NameSpace.Training>): Training | null =>
  state[NameSpace.Training].training;
export const selectReviews = (state: Pick<State, NameSpace.Training>): Review[] =>
  state[NameSpace.Training].reviews;
export const selectBalance = (state: Pick<State, NameSpace.Training>): Balance | null =>
  state[NameSpace.Training].balance;
export const selectTrainingDataIsLoading = (state: Pick<State, NameSpace.Training>): boolean =>
  state[NameSpace.Training].isLoading;
