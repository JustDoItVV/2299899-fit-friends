import { Transform } from 'class-transformer';

export function TransformArrayInt(default2: number) {
  return Transform((data) => {
    if (!Array.isArray(data.value)) {
      return [parseInt(data.value, 10), default2];
    }

    return data.value.map((value) => parseInt(value, 10));
  });
}
