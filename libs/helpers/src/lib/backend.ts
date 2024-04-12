import { ValidationArguments } from 'class-validator';

export const getDtoMessageCallback = (message: string) =>
  (arg: ValidationArguments) => `${arg.property} ${message}`;
