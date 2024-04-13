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
  Required  ='Обязательное поле',
  Nan = 'Должно быть числом',
  Enum = 'Должно быть одним из значений',
  NotString = 'Должно быть строкой',
  NotValid = 'Невалидное значение',
  MustBeArray = 'Значения должны быть в массиве',
  EmailUpdateForbidden = 'email Обновление email запрещено',
  PasswordMinLength = `Минимальная длина ${PasswordLength.Min} символов`,
  PasswordMaxLength = `Максимальная длина ${PasswordLength.Max} символов`,
  PasswordWrong = 'password Неверный пароль',
  PasswordUpdateForbidden = 'password Изменение пароля запрещено',
  NotFound = 'email Пользователь не найден',
  OnlyAnonymous = 'forbidden Доступно только для неавторизованных пользователей',
  TokenCreationError = 'token Ошибка создания токена',
  NameWrongPattern = 'Допустимы только символы латиницы и кириллицы, одно слово',
  NameMinLength = `Минимальная длина ${NameLength.Min} символов`,
  NameMaxLength = `Максимальная длина ${NameLength.Max} символов`,
  RoleUpdateForbidden = 'role Обновление роли пользователя запрещено',
  DescriptionMinLength = `Минимальная длина ${UserDescriptionLength.Min} символов`,
  DescriptionMaxLength = `Максимальная длина ${UserDescriptionLength.Max} символов`,
  TrainingTypeMaxSize = `Максимальное количество типов тренировок ${TRAINING_TYPE_LIMIT}`,
  TrainingTypeMinSize = `Минимальное количество типов тренировок ${TRAINING_TYPE_LIMIT}`,
  CaloriesTargetMin = `Минимальное значение ${CaloriesTargetLimit.Min}`,
  CaloriesTargetMax = `Максимальное значение ${CaloriesTargetLimit.Max}`,
  CaloriesPerDayMin = `Минимальное значение ${CaloriesPerDayLimit.Min}`,
  CaloriesPerDayMax = `Максимальное значение ${CaloriesPerDayLimit.Max}`,
  MeritsMinLength = `Минимальная длина ${MeritsLength.Min} символов`,
  MeritsMaxLength = `Максимальная длина ${MeritsLength.Max} символов`,
  UserExists = 'email Пользователь с таким email уже существует',
  UserUpdateForbidden = 'forbidden Профиль не принадлежит текущему пользователю',
  FileFormatForbidden = 'file Запрещенный формат файла',
  NoFileUploaded = 'file Файл не загружен',
  InFriendsAlready = 'friends Пользователь уже в друзьях',
  NotInFriends = 'friends Пользователь не в друзьях',
  UserSelfFriend = 'friends Пользователь не может добавиться или удалиться из своих друзей',
  UserSelfSubscriber = 'subscribe Пользователь не может подписаться на самого себя',
  UserSelfUnsubscriber = 'subscribe Пользователь не может отписаться от самого себя',
  InSubscribtionsAlready = 'subscribe Пользователь уже в подписках',
  NotInSubscribtions = 'subscribe Пользователь не в подписках',
  SubscribeForbidden = 'subscribe Пользователь не является тренером',
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

export enum ApiAccountUserMessage {
  FriendsList = 'Список друзей Пользователя',
  Balance = 'Баланс пользователя',
  BalanceUpdateSuccess = 'Баланс записи успешно обновлен',
  SendNews = 'Рассылка уведомлений по email успешно запущена',
}
