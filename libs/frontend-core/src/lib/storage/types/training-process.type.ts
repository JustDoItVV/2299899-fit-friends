import { Balance, Review, Training } from '@2299899-fit-friends/types';

export type TrainingProcess = {
  training: Training | null;
  reviews: Review[];
  balance: Balance | null;
  isLoading: boolean;
};
