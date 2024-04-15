export enum TitleLength {
  Min = 1,
  Max = 15,
}

export enum TrainingBackgroundPictureAllowedExtensions {
  jpg = 'image/jpeg',
  png = 'image/png',
}

export enum PriceLimit {
  Min = 0,
  MockMax = 10000,
  Max = 2147483647,
}

export enum TrainingDescriptionLimit {
  Min = 10,
  Max = 140,
}

export enum TrainingVideoAllowedExtensions {
  mov = 'video/quicktime',
  avi = 'video/x-msvideo',
  mp4 = 'video/mp4',
}

export const TRAINING_DEFAULT_RATING = 0;

export enum TrainingCaloriesLimit {
  Min = 1000,
  Max = 5000,
}

export enum TrainingErrorMessage {
  Nan = 'Должно быть числом',
  NotString = 'Должно быть строкой',
  NotFound = 'Не найдено',
  Required = 'Обязательное поле',
  Enum = 'Должно быть одно из значений',
  UpdateForbidden = 'Обновление запрещено, тренировка не принадлежит текущему пользователю',
  TitleMinLength = `Минимальная длина ${TitleLength.Min} символов`,
  TitleMaxLength = `Максимальная длина ${TitleLength.Max} символов`,
  PriceMin = `Минимальное значение ${PriceLimit.Min}`,
  PriceMax = `Максимальное значение ${PriceLimit.Max}`,
  CaloriesMin = `Минимальное значение ${TrainingCaloriesLimit.Min}`,
  CaloriesMax = `Максимальное значение ${TrainingCaloriesLimit.Max}`,
  DescriptionMinLength = `Минимальная длина ${TrainingDescriptionLimit.Min} символов`,
  DescriptionMaxLength = `Максимальная длина ${TrainingDescriptionLimit.Max} символов`,
  FileFormatForbidden = 'file Запрещенный формат файла',
  NoFileUploaded = 'file Файл не загружен',
}

export enum ApiTrainingMessage {
  ValidationError = 'Ошибка валидации данных',
  CreateSuccess = 'Тренировка успешно создана',
  UnsupportedFile = 'Неподдерживаемый тип файлов или размер фалов превышает допустимое значение',
  Catalog = 'Каталог тренировок с пагинацией',
  TrainingInfo = 'Детальная информация о тренировке',
  NotFound = 'Тренировка не найдена',
  UpdateSuccess = 'Детальная информация обновленной тренировки',
  BackgroundPicture = 'Файл фоновой картинки тренировки в виде data url',
  NotFoundFile = 'Тренировка или файл не найдены',
  Video = 'Файл видео тренировки',
}

export enum ApiAccountTrainerMessage {
  Catalog = 'Список тренировок Тренера',
  Orders = 'Список заказов Тренера',
  Friends = 'Список друзей Тренера',
}
