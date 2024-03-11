import { TrainingDuration } from './training-duration.enum';
import { TrainingLevel } from './training-level.enum';
import { TrainingType } from './training-type.enum';
import { UserGender } from './user-gender.enum';
import { UserRole } from './user-role.enum';

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar: string | undefined;
  passwordHash: string;
  gender: UserGender;
  birthdate: Date | undefined;
  role: UserRole;
  description: string | undefined;
  location: string;
  pageBackground: string;
  trainingLevel: TrainingLevel;
  trainingType: TrainingType[];
  trainingDuration: TrainingDuration | undefined;
  caloriesTarget: number | undefined;
  caloriesPerDay: number | undefined;
  isReadyToTraining: boolean | undefined;
  certificate: string | undefined;
  merits: string | undefined;
  isReadyToPersonal: boolean | undefined;
  accessToken?: string;
  refreshToken?: string;
}
