import { Transform } from 'class-transformer';

export function TransformToArray() {
  const parseValue = (value: string) => {
    return value.split(',');
  };

  return Transform((data) => {
    if (Array.isArray(data.value)) {
      return data.value;
    }

    return parseValue(data.value);
  });
}
