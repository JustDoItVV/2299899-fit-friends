import { AuthStatus, ResponseError, User } from '@2299899-fit-friends/types';

export type UserProcess = {
  authStatus: AuthStatus;
  currentUser: User | null;
  user: User | null;
  responseError: ResponseError | null;
};
