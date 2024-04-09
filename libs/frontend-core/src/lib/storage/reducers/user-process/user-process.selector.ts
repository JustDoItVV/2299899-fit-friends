import { NameSpace, User } from '@2299899-fit-friends/types';

import { State } from '../../types/state.type';

export const selectUser = (state: Pick<State, NameSpace.User>): User | null =>
  state[NameSpace.User].user;
