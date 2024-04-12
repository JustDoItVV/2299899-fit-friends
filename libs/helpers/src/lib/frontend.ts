import { ResponseError } from '@2299899-fit-friends/types';

export const getResponseErrorMessage = (
  responseError: ResponseError | null,
  field: string
) => {
  const { statusCode, message } = responseError || {};

  if (!statusCode || !message) {
    return '';
  }

  if (!Array.isArray(message)) {
    if (message.split(' ')[0] === field) {
      return message.split(' ').slice(1).join(' ');
    }
    return null;
  }

  const fieldMessage = message.filter((item) => item.toLowerCase().includes(field))[0];

  if (!fieldMessage) {
    return null;
  }

  return fieldMessage.split(' ').slice(1).join(' ');
};
