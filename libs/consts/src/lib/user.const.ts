export enum NameLength {
  Min = 1,
  Max = 15,
}

export const AvatarAllowedExtensions = {
  jpg: 'image/jpg',
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
  jpg: 'image/jpg',
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
  NotFound = 'User with this email not found',
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
}

export enum AllowedImageFormat {
  jpg = 'image/jpg',
  png = 'image/png',
}

export enum AllowedCertificateFormat {
  pdf = 'application/pdf',
}
