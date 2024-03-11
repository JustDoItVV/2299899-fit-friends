export enum TitleLength {
  Min = 1,
  Max = 15,
}

export const TrainingBackgroundPictureAllowedExtensions = {
  jpg: 'image/jpg',
  png: 'image/png',
} as const;

export enum PriceLimit {
  Min = 0,
  Max = 10000000,
}

export enum TrainingDescriptionLimit {
  Min = 10,
  Max = 140,
}

export const TrainingVideoAllowedExtensions = {
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  mp4: 'video/mp4',
} as const;

export const TRAINING_DEFAULT_RATING = 0;
