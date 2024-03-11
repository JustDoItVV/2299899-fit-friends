import { User } from './user.interface';

export interface RequestPersonalTraining {
  id?: string;
  author: User;
  target: User;
  status: string;
}
