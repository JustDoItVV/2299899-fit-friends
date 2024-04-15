export const BALANCE_AVAILABLE_MIN = 0;

export enum BalanceErrorMessage {
  Required = 'Обязательное поле',
  Nan = 'Должно быть числом',
  Enum = 'Должно быть одним из значений',
  AvailableMin = `Минимальное значение для количества тренировок ${BALANCE_AVAILABLE_MIN}`,
}
