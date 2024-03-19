import { TrainingAuditory } from './training-auditory.enum';
import { TrainingDuration } from './training-duration.enum';
import { TrainingLevel } from './training-level.enum';
import { TrainingType } from './training-type.enum';

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
  gender: TrainingAuditory;
  video: string;
  rating: number;
  userId: string;
  isSpecialOffer: boolean;
}
