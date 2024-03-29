export const BACKEND_GLOBAL_PREFIX = 'api';

export const NOT_IMPLEMENTED_ERROR = 'Not implemented';

export const SALT_ROUNDS = 10;

export enum CommonError {
  FileNotFound = 'File not found',
}

export enum DefaultPagination {
  Limit = 50,
  Page = 1,
}

export enum ApiTag {
  Users = 'Пользователи',
  AccountTrainer = 'Личный кабинет тренера',
  AccountUser = 'Личный кабинет пользователя',
  Notifications = 'Оповещения',
  TrainingRequests = 'Персональные тренировки/совместные тренировки',
  TrainingCatalog = 'Каталог тренировок',
  Reviews = 'Отзывы',
}
