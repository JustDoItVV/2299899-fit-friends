import 'multer';

import { Express } from 'express';

export interface TrainingFilesPayload {
  backgroundPicture: Express.Multer.File[],
  video: Express.Multer.File[],
}
