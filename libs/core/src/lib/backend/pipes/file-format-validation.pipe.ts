import 'multer';

import { UserFilesPayload } from '@2299899-fit-friends/types';
import { Injectable, PipeTransform, UnsupportedMediaTypeException } from '@nestjs/common';

@Injectable()
export class FileFormatValidationPipe implements PipeTransform<UserFilesPayload, UserFilesPayload> {
  public allowedFormats: Record<string, string>;
  public message: string;

  constructor(allowedFormats: Record<string, string>, message: string) {
    this.allowedFormats = allowedFormats;
    this.message = message;
  }

  transform(value: UserFilesPayload): UserFilesPayload {
    for (const key of Object.keys(value)) {
      value[key].map((file: Express.Multer.File) => {
        if (file) {
          const { originalname, mimetype } = file;
          const fileExtention = originalname.split('.').at(-1);

          const isValidFormatCondition1 = Object.keys(this.allowedFormats).includes(fileExtention);
          const isValidFormatCondition2 = this.allowedFormats[fileExtention] === mimetype;

          if (!isValidFormatCondition1 || !isValidFormatCondition2) {
            throw new UnsupportedMediaTypeException(this.message);
          }
        }
      });
    }

    return value;
  }
}
