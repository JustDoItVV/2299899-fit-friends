import 'multer';

import { Express } from 'express';

export interface UserFilesPayload {
  avatar?: Express.Multer.File[],
  pageBackground: Express.Multer.File[],
}
