import { AuthStatus, NameSpace, ResponseError, User } from '@2299899-fit-friends/types';

import { State } from '../../types/state.type';

export const selectAuthStatus = (state: Pick<State, NameSpace.App>): AuthStatus =>
  state[NameSpace.App].authStatus;
export const selectCurrentUser = (state: Pick<State, NameSpace.App>): User | null =>
  state[NameSpace.App].currentUser;
export const selectResponseError = (state: Pick<State, NameSpace.App>): ResponseError | null =>
  state[NameSpace.App].responseError;
