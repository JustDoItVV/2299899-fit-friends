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
  NotString = 'Must be a string',
  EmailRequired = 'Email required',
  EmailNotValid = 'Email not valid',
  PasswordRequired = 'Password required',
  PasswordWrong = 'Wrong password',
  NotFound = 'User with this email not found',
  OnlyAnonymous = 'Forbidden. Allowed only for unauthorized',
  TokenCreationError = 'Token creation error',
}
