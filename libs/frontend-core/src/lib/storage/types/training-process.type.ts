import { Training, User } from '@2299899-fit-friends/types';

export type TrainingProcess = {
  pageItems: Training[] | User[];
  totalPages: number;
  currentPage: number;
};
