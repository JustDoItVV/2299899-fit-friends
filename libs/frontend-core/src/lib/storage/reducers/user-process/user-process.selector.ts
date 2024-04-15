import { NameSpace, User } from '@2299899-fit-friends/types';

import { State } from '../../types/state.type';

export const selectUser = (state: Pick<State, NameSpace.User>): User | null =>
  state[NameSpace.User].user;
export const selectIsUserLoading = (state: Pick<State, NameSpace.User>): boolean =>
  state[NameSpace.User].isLoading;
