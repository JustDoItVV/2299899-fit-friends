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
  Nan = 'must be a number',
  NotInt = 'must be integer',
  NotString = 'must be string',
  NotFound = 'Trainin not found',
  UpdateForbidden = 'Update forbidden, user does not own this training',
  TitleRequired = 'Title required',
  TitleMinLength = `Title min length is ${TitleLength.Min} symbols`,
  TitleMaxLength = `Title max length is ${TitleLength.Max} symbols`,
  BackgroundPictureRequired = 'Background picture file required',
  LevelRequired = 'Training level required',
  TypeRequired = 'Training type required',
  DurationRequired = 'Training duration required',
  PriceRequired = 'Price required',
  PriceMin = `Price min value is ${PriceLimit.Min}`,
  PriceMax = `Price max value is ${PriceLimit.Max}`,
  CaloriesRequired = 'Calories required',
  CaloriesMin = `Calories min value is ${TrainingCaloriesLimit.Min}`,
  CaloriesMax = `Calories max value is ${TrainingCaloriesLimit.Max}`,
  DescriptionRequired = 'Description required',
  DescriptionMinLength = `Description min length is ${TrainingDescriptionLimit.Min} symbols`,
  DescriptionMaxLength = `Description max length is ${TrainingDescriptionLimit.Max} symbols`,
  GenderRequired = 'Gender required',
  VideoRequired = 'Training video required',
  IsSpecialOfferRequired = 'IsSpecialOffer flag required',
  IsSpecialOfferBool = 'IsSpecialOffer must be boolean',
  FileFormatForbidden = 'File format forbidden',
}
