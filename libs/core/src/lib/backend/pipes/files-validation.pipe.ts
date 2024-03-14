import 'multer';

import { UserFilesPayload } from '@2299899-fit-friends/types';
import { Injectable, PipeTransform, UnsupportedMediaTypeException } from '@nestjs/common';

type ValidationRules = Record<string, {
  size?: number;
  formats?: Record<string, string>,
 }>

@Injectable()
export class FilesValidationPipe implements PipeTransform<UserFilesPayload, UserFilesPayload> {
  public rules: ValidationRules;
  public message: string;

  constructor(rules: ValidationRules, message: string) {
    this.rules = rules;
    this.message = message;
  }

  transform(value: UserFilesPayload): UserFilesPayload {
    for (const key of Object.keys(value)) {
      value[key].map((file: Express.Multer.File) => {
        if (file) {
          const { originalname, mimetype, size } = file;
          const fileExtention = originalname.split('.').at(-1);

          const isValidSize = this.rules[key].size ? size <= this.rules[key].size : true;

          const isValidFormatCondition1 = this.rules[key].formats ? Object.keys(this.rules[key].formats).includes(fileExtention) : true;
          const isValidFormatCondition2 = this.rules[key].formats ? this.rules[key].formats[fileExtention] === mimetype : true;

          if (!isValidSize || !isValidFormatCondition1 || !isValidFormatCondition2) {
            throw new UnsupportedMediaTypeException(this.message);
          }
        }
      });
    }

    return value;
  }
}
