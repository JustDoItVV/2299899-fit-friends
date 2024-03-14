import 'multer';

import { UserFilesPayload } from '@2299899-fit-friends/types';
import { Injectable, PipeTransform, UnsupportedMediaTypeException } from '@nestjs/common';

@Injectable()
export class FileFormatValidationPipe implements PipeTransform<UserFilesPayload, UserFilesPayload> {
  public rules: Record<string, Record<string, string>>;
  public message: string;

  constructor(rules: Record<string, Record<string, string>>, message: string) {
    this.rules = rules;
    this.message = message;
  }

  transform(value: UserFilesPayload): UserFilesPayload {
    for (const key of Object.keys(value)) {
      value[key].map((file: Express.Multer.File) => {
        if (file) {
          const { originalname, mimetype } = file;
          const fileExtention = originalname.split('.').at(-1);

          const isValidFormatCondition1 = Object.keys(this.rules[key]).includes(fileExtention);
          const isValidFormatCondition2 = this.rules[key][fileExtention] === mimetype;

          if (!isValidFormatCondition1 || !isValidFormatCondition2) {
            throw new UnsupportedMediaTypeException(this.message);
          }
        }
      });
    }

    return value;
  }
}
