import 'multer';

import { FilesValidationRules } from '@2299899-fit-friends/types';
import {
  Injectable,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

export interface FilesPayload {
  [key: string]: Express.Multer.File[];
}

@Injectable()
export class FilesValidationPipe
  implements PipeTransform<FilesPayload, FilesPayload>
{
  public rules: FilesValidationRules;
  public message: string;

  constructor(rules: FilesValidationRules, message: string) {
    this.rules = rules;
    this.message = message;
  }

  transform(value: FilesPayload): FilesPayload {
    if (value) {
      for (const key of Object.keys(value)) {
        value[key].map((file: Express.Multer.File) => {
          if (file) {
            const { originalname, mimetype, size } = file;
            const fileExtention = originalname.split('.').at(-1);

            const isValidSize = this.rules[key].size
              ? size <= this.rules[key].size
              : true;

            const isValidFormatCondition1 = this.rules[key].formats
              ? Object.keys(this.rules[key].formats).includes(fileExtention)
              : true;
            const isValidFormatCondition2 = this.rules[key].formats
              ? this.rules[key].formats[fileExtention] === mimetype
              : true;

            if (
              !isValidSize ||
              !isValidFormatCondition1 ||
              !isValidFormatCondition2
            ) {
              throw new UnsupportedMediaTypeException(`${key} ${this.message}`);
            }
          }
        });
      }
    }

    return value;
  }
}
