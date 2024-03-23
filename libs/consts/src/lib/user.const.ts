export enum NameLength {
  Min = 1,
  Max = 15,
}

export const AvatarAllowedExtensions = {
  jpg: 'image/jpeg',
  png: 'image/png',
} as const;

export const AVATAR_SIZE_LIMIT = 1000000;

export enum PasswordLength {
  Min = 6,
  Max = 12,
}

export enum UserDescriptionLength {
  Min = 10,
  Max = 140,
}

export const METRO_STATIONS = [
  'Пионерская',
  'Петроградская',
  'Удельная',
  'Звёздная',
  'Спортивная',
];

export const UserBackgroundImageAllowedExtensions = {
  jpg: 'image/jpeg',
  png: 'image/png',
} as const;

export enum CaloriesTargetLimit {
  Min = 1000,
  Max = 5000,
}

export enum CaloriesPerDayLimit {
  Min = 1000,
  Max = 5000,
}

export const TRAINING_TYPE_LIMIT = 3;

export const CertificateAllowedExtensions = {
  pdf: 'application/pdf',
} as const;

export enum MeritsLength {
  Min = 10,
  Max = 140,
}

export enum UserErrorMessage {
  Nan = 'Must be a number',
  NotBoolString = 'Must be "true" or "false" string',
  NotString = 'Must be a string',
  EmailRequired = 'Email required',
  EmailNotValid = 'Email not valid',
  EmailUpdateForbidden = 'Email updating forbidden',
  PasswordRequired = 'Password required',
  PasswordMinLength = `Password min length is ${PasswordLength.Min} symbols`,
  PasswordMaxLength = `Password max length is ${PasswordLength.Max} symbols`,
  PasswordWrong = 'Wrong password',
  PasswordUpdateForbidden = 'Password updating forbidden',
  NotFound = 'User not found',
  OnlyAnonymous = 'Forbidden. Allowed only for unauthorized',
  TokenCreationError = 'Token creation error',
  NameRequired = 'User\'s name required',
  NameWrongPattern = 'Allowed only latin and russian letters',
  NameMinLength = `User name min length is ${NameLength.Min} symbols`,
  NameMaxLength = `User name max length is ${NameLength.Max} symbols`,
  GenderRequired = 'Gender required',
  BirthdateNotValid = 'Brithdate not valid date',
  RoleRequired = 'Role required',
  RoleUpdateForbidden = 'Role updating forbidden',
  DescriptionMinLength = `Description min length is ${UserDescriptionLength.Min} symbols`,
  DescriptionMaxLength = `Description max length is ${UserDescriptionLength.Max} symbols`,
  LocationRequired = 'Location by metro station is required',
  TrainingLevelRequired = 'Training level required',
  TrainingTypeRequired = 'Training type required',
  TariningTypeMustBeArray = 'Training type must be an array',
  TrainingTypeMaxSize = `Training type array max size is ${TRAINING_TYPE_LIMIT}`,
  TrainingTypeMinSize = `Training type array min size is ${TRAINING_TYPE_LIMIT}`,
  TrainingDurationRequired = 'Training duration required',
  CaloriesTargetRequired = 'Calories target required',
  CaloriesTargetMin = `Calories target min is ${CaloriesTargetLimit.Min}`,
  CaloriesTargetMax = `Calories target max is ${CaloriesTargetLimit.Max}`,
  CaloriesPerDayRequired = 'Calories per day required',
  CaloriesPerDayMin = `Calories per day min is ${CaloriesPerDayLimit.Min}`,
  CaloriesPerDayMax = `Calories per day max is ${CaloriesPerDayLimit.Max}`,
  IsReadyToTrainingRequired = 'isReadyToTraining flag required',
  MeritsMinLength = `Merits min length is ${MeritsLength.Min} symbols`,
  MeritsMaxLength = `Merits max length is ${MeritsLength.Max} symbols`,
  IsReadyToPersonalRequired = 'isReadyToPersonal flag required',
  UserExists = 'User with this email already exists',
  UserUpdateForbidden = 'Update forbidden. User does not own this profile',
  ImageFormatForbidden = 'Image format forbidden',
  CertificateFormatForbidden = 'Certificate format forbidden',
  PageBackgroundRequired = 'Pagebackground files required',
  NoFileUploaded = 'No file was uploaded',
  InFriendsAlready = 'User already in friends',
  NotInFriends = 'User not in friends',
  UserSelfFriend = 'User cannot add or remove himself to or from friends',
  UserSelfSubscriber = 'User cannot subscribe to himself',
  UserSelfUnsubscriber = 'User cannot unsubscribe from himself',
  InSubscribtionsAlready = 'User already in subscribtions',
  NotInSubscribtions = 'User not in subscribtions',
  SubscribeForbidden = 'User is not trainer',
}

export enum AllowedImageFormat {
  jpg = 'image/jpeg',
  png = 'image/png',
}

export enum AllowedCertificateFormat {
  pdf = 'application/pdf',
}

export enum ApiUserMessage {
  Unauthorized = 'Пользователь не авторизован',
  Authorized = 'Пользователь авторизован',
  NotFound = 'Пользователь не найден',
  LoginWrong = 'Неверный логин',
  PasswordWrong = 'Неверный пароль',
  ValidationError = 'Ошибка валидации данных',
  UserOrFileNotFound = 'Пользователь или файл не найден',
  Catalog = 'Каталог пользователей',
  Card = 'Карточка пользователя',
  TokenNew = 'Новая пара токенов',
  TokenRevoked = 'Токен отозван',
  Registered = 'Пользователь успешно зарегистрирован',
  EmailExists = 'Пользователь с таким email уже существует',
  FileImageUrl = 'Изображение в виде data url',
  FileCertificate = 'Файл сертификата пользователя',
  ForbiddenExceptUser = 'Запрещено кроме пользователя с ролью "пользователь"',
  ForbiddenExceptTrainer = 'Запрещено кроме пользователя с ролью "тренер"',
  ForbiddenAuthorized = 'Запрещено для авторизованных пользователей',
  UnsupportedMediaFiles = 'Неподдерживаемый тип файлов или файл превышает допустимый размер',
  FriendAddSuccess = 'Пользователь успешно добавлен в друзья',
  FriendAddAlready = 'Пользователь уже в друзьях',
  FriendAddDeleteSelf = 'Пользователь не может добавить/удалить самого себя в/из друзей',
  FriendDeleteSuccess = 'Пользователь успешно удален из друзей',
  FriendDeleteAlready = 'Пользователь не в друзьях',
  SubscribeAddSuccess = 'Пользователь успешно подписан на уведомления',
  SubscribeAddAlready = 'Пользователь уже подписан на уведомления',
  SubscribeAddDeleteSelf = 'Пользователь не может подписаться/отписаться на/от самого себя',
  SubscribeDeleteSuccess = 'Пользователь успешно отписан от уведомлений',
  SubscribeDeleteAlready = 'Пользователь не подписан на уведомления',
  ForbiddenSubscribe = 'Нельзя подписаться/отписаться на/от обычного пользователя',
}
