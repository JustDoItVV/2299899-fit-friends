import { TrainingDuration } from './training-duration.enum';
import { TrainingLevel } from './training-level.enum';
import { TrainingType } from './training-type.enum';
import { UserGender } from './user-gender.enum';
import { UserRole } from './user-role.enum';

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  passwordHash: string;
  gender: UserGender;
  birthdate?: Date;
  role: UserRole;
  description?: string;
  location: string;
  pageBackground: string;
  trainingLevel: TrainingLevel;
  trainingType: TrainingType[];
  trainingDuration?: TrainingDuration;
  caloriesTarget?: number;
  caloriesPerDay?: number;
  isReadyToTraining?: boolean;
  certificates?: string[];
  merits?: string | undefined;
  isReadyToPersonal?: boolean;
  accessToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  friends?: string[];
  subscribers?: string[];
  emailSubscribtions?: string[];
  emailLastDate?: Date;
}
