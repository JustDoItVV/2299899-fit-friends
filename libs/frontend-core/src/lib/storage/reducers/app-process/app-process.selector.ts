import { AuthStatus, NameSpace, ResponseError, User } from '@2299899-fit-friends/types';

import { State } from '../../types/state.type';

export const selectAuthStatus = (state: Pick<State, NameSpace.User>): AuthStatus =>
  state[NameSpace.App].authStatus;
export const selectCurrentUser = (state: Pick<State, NameSpace.User>): User | null =>
  state[NameSpace.App].currentUser;
export const selectResponseError = (state: Pick<State, NameSpace.User>): ResponseError | null =>
  state[NameSpace.App].responseError;
