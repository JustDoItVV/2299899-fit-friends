import { TokenPayload, User } from '@2299899-fit-friends/types';

export function createJWTPayload(user: User): TokenPayload {
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
  };
}
