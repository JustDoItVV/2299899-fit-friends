import {
    ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface
} from 'class-validator';

import { TRAINING_TYPE_LIMIT } from '@2299899-fit-friends/consts';
import { UserRole } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'ArrayMinLengthByUserRole', async: false })
export class ArrayMinLengthByUserRole implements ValidatorConstraintInterface {
  validate(array: string[], validationArguments: ValidationArguments) {
    const min = validationArguments.object['role'] === UserRole.Trainer ? TRAINING_TYPE_LIMIT : 0;
    return array.length >= min;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments: ValidationArguments): string {
    const min = validationArguments.object['role'] === UserRole.Trainer ? TRAINING_TYPE_LIMIT : 0;
    return `Array min length is ${min}`;
  }
}
