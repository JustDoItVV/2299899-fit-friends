import { AuthStatus, User } from '@2299899-fit-friends/types';

export type ResponseError = {
  error: string;
  message: string | string[];
  statusCode: number;
};

export type UserProcess = {
  authStatus: AuthStatus;
  user: User | null;
  responseError: ResponseError | null;
};
