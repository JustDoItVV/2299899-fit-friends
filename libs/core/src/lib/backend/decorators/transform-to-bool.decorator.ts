import { Transform } from 'class-transformer';

import { BadRequestException } from '@nestjs/common';

export function TransformToBool(message: string) {
  const parseValue = (value: string) => {
    if (value !== 'true' && value !== 'false') {
      throw new BadRequestException(`${value} ${message}`);
    }

    return value === 'true';
  };

  return Transform((data) => parseValue(data.value));
}
