import { User } from './user.interface';

export interface UserWithToken extends User {
  accessToken: string;
  refreshToken: string;
}
