import { ValidationArguments } from 'class-validator';

export const getDtoMessageCallback = (message: string, values: null | object = null) =>
  (arg: ValidationArguments) => {
    let argMessage = `${arg.property} ${message}`;

    if (values instanceof Object) {
      if (values instanceof Array) {
        argMessage += `: ${values.join(', ')}`;
      } else {
        argMessage += `: ${Object.values(values).join(', ')}`;
      }
    }

    return argMessage;
  }
