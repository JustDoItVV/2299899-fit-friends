import { Transform } from 'class-transformer';

import { BadRequestException } from '@nestjs/common';

export function TransformToInt(message: string) {
  const parseValue = (value: string) => {
    const parsedValue = parseInt(value, 10);

    if (!parsedValue) {
      throw new BadRequestException(`${value} ${message}`);
    }

    return parsedValue;
  };

  return Transform((data) => {
    if (Array.isArray(data.value)) {
      return data.value.map((value) => parseValue(value));
    }

    return parseValue(data.value);
  });
}
