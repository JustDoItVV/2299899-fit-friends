import { AuthStatus, NameSpace, User } from '@2299899-fit-friends/types';

import { State } from '../types/state.type';
import { ResponseError } from '../types/user-process.type';

export const selectAuthStatus = (
  state: Pick<State, NameSpace.User>
): AuthStatus => state[NameSpace.User].authStatus;
export const selectCurrentUser = (
  state: Pick<State, NameSpace.User>
): User | null => state[NameSpace.User].currentUser;
export const selectUser = (state: Pick<State, NameSpace.User>): User | null =>
  state[NameSpace.User].user;
export const selectResponseError = (
  state: Pick<State, NameSpace.User>
): ResponseError | null => state[NameSpace.User].responseError;
