import { Training } from './training.interface';
import { User } from './user.interface';

export interface Review {
  id?: string;
  user: User;
  training: Training;
  rating: number;
  text: string;
}
