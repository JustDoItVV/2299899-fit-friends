export interface Balance {
  id?: string;
  userId: string;
  trainingId: string;
  available: number;
  updatedAt?: Date;
  createdAt?: Date;
}
