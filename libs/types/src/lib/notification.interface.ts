import { User } from './user.interface';

export interface Notification {
  id?: string;
  sentDate: Date;
  user: User;
  text: string;
}
