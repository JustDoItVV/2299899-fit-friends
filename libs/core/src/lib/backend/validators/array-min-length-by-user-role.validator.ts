import {
    ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface
} from 'class-validator';

import { TRAINING_TYPE_LIMIT, UserErrorMessage } from '@2299899-fit-friends/consts';
import { UserRole } from '@2299899-fit-friends/types';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'ArrayMinLengthByUserRole', async: false })
export class ArrayMinLengthByUserRole implements ValidatorConstraintInterface {
  validate(values: string[], validationArguments: ValidationArguments) {
    if (!values) {
      throw new BadRequestException(UserErrorMessage.TrainingTypeRequired);
    }
    const uniqueValues = [... new Set(values)];
    const min = validationArguments.object['role'] === UserRole.Trainer ? TRAINING_TYPE_LIMIT : 0;
    return uniqueValues.length >= min;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const min = validationArguments.object['role'] === UserRole.Trainer ? TRAINING_TYPE_LIMIT : 0;
    return `${validationArguments.property} unique values array min length is ${min}`;
  }
}
