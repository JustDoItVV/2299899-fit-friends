import { AuthStatus, ResponseError, User } from '@2299899-fit-friends/types';

export type AppProcess = {
  authStatus: AuthStatus;
  currentUser: User | null;
  responseError: ResponseError | null;
};
