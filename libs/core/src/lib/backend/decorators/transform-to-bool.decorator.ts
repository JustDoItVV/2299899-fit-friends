import { Transform } from 'class-transformer';

import { BadRequestException } from '@nestjs/common';

export function TransformToBool(message: string) {
  const parseValue = (value: unknown, property: string) => {
    if (value instanceof Boolean) {
      return value;
    }

    if (value !== 'true' && value !== 'false') {
      throw new BadRequestException(`${property} ${message}`);
    }

    return value === 'true';
  };

  return Transform((data) => {
    if (data.value instanceof Boolean) {
      return data.value;
    }

    return parseValue(data.value, data.key);
  });
}
