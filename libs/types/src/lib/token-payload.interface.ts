import { UserRole } from './user-role.enum';

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}
