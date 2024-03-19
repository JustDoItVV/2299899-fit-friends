import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { UnsupportedMediaTypeException } from '@nestjs/common';

type ValidationRules = Record<string, {
  size?: number;
  formats?: Record<string, string>,
 }>

export function IsValidFile(rules: ValidationRules, validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isValidFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyName],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: unknown, _args: ValidationArguments) {
          // const [relatedPropertyName] = args.constraints;
          // const relatedValue = args.object[relatedPropertyName];
          // console.log(object);
          if (value) {
            for (const key of Object.keys(value)) {
              value[key].map((file: Express.Multer.File) => {
                if (file) {
                  const { originalname, mimetype, size } = file;
                  const fileExtention = originalname.split('.').at(-1);

                  const isValidSize = this.rules[key].size ? size <= this.rules[key].size : true;

                  const isValidFormatCondition1 = this.rules[key].formats ? Object.keys(this.rules[key].formats).includes(fileExtention) : true;
                  const isValidFormatCondition2 = this.rules[key].formats ? this.rules[key].formats[fileExtention] === mimetype : true;

                  if (!isValidSize || !isValidFormatCondition1 || !isValidFormatCondition2) {
                    throw new UnsupportedMediaTypeException();
                  }
                }
              });
            }
          }

          return true;
        },
      },
    });
  };
}
