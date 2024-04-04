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
    return message;
  }

  return message.filter((item) => item.toLowerCase().includes(field))[0];
};
