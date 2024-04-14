export enum RatingLimit {
  Min = 1,
  Max = 5,
}

export enum ReviewTextLength {
  Min = 100,
  Max = 1024,
}

export enum ReviewErrorMessage {
  Required = 'Обязательное поле',
  Nan = 'Должно быть числом',
  NotString = 'Должно быть строкой',
  RatingMin = `Минимальное значение рейтинга ${RatingLimit.Min}`,
  RatingMax = `Максимальное значение рейтинга ${RatingLimit.Max}`,
  TextLengthMin = `Минимальная длина отзыва ${ReviewTextLength.Min} символов`,
  TextLengthMax = `Максимальная длина отзыва ${ReviewTextLength.Max} символов`,
}

export enum ApiReviewMessage {
  CreateSuccess = 'Отзыв создан',
  List = 'Список отзывов к тренировке',
}
