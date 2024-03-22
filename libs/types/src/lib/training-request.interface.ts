export interface TrainingRequest {
  id?: string;
  authorId: string;
  targetId: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
