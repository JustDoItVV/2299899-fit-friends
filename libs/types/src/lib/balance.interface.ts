import { Training } from './training.interface';

export interface Balance {
  id?: string;
  training: Training;
  isAvailable: boolean;
}
