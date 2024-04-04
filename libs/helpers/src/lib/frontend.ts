export const getResponseErrorMessage = (
  statusCode: number | undefined,
  message: string | string[] | undefined,
  field: string
) => {
  if (!statusCode || !message) {
    return '';
  }

  if (!Array.isArray(message)) {
    return message;
  }

  return message.filter((item) => item.toLowerCase().includes(field)).join(', ');
};
