import { TrainingDuration } from './training-duration.enum';
import { TrainingLevel } from './training-level.enum';
import { TrainingType } from './training-type.enum';
import { User } from './user.interface';

export interface Training {
  id?: string;
  title: string;
  backgroundPicture: string;
  level: TrainingLevel;
  type: TrainingType;
  duration: TrainingDuration;
  price: number;
  calories: number;
  description: string;
  gender: string;
  video: string;
  rating: number;
  user: User;
  isSpecialOffer: boolean;
}
