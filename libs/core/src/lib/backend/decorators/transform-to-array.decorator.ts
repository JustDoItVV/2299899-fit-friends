import { Transform } from 'class-transformer';

import { UserErrorMessage } from '@2299899-fit-friends/consts';
import { BadRequestException } from '@nestjs/common';

export function TransformToArray() {
  const parseValue = (value: string) => {
    return value.split(',');
  };

  return Transform((data) => {
    if (!data || !data.value) {
      throw new BadRequestException(UserErrorMessage.TrainingTypeRequired);
    }

    return parseValue(data.value);
  });
}
