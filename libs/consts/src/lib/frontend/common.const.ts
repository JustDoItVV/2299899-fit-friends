export const BACKEND_URL = 'http://localhost:3001/api';
export const REQUEST_TIMEOUT = 5000;
export const DEBOUNCE_THRESHOLD = 500;

export enum ApiRoute {
  User = '/user',
  Register = '/register',
  Login = '/login',
  Check = '/check',
  Refresh = '/refresh',
  Avatar = '/avatar',
  PageBackground = '/page-background',
  Certificates = '/certificates',
  Friend = '/friend',
  Friends = '/friends',
  Subscribe = '/subscribe',
  Balance = '/balance',
  SendNewTrainingsMail = '/send-new-trainings-mail',
  Notification = '/notification',
  Training = '/training',
  BackgroundPicture = '/backgroundPicture',
  Video = '/video',
  Account = '/account',
  Trainer = '/trainer',
  Orders = '/orders',
  Reviews = '/reviews',
  TrainingRequest = '/training-request',
}

export const ResponseErrorMessage = new Map([
  [404, 'Страница не найдена'],
  [500, 'Внутренняя ошибка сервера',],
]);

export const SliderBlockItems = {
  DefaultPerPage: 1,
  DefaultToScroll: 1,
  ForYouMax: 9,
  ForYouVisible: 3,
  SpecialMax: 3,
  SpecialVisible: 1,
  PopularVisible: 4,
  PopularMax: 8,
  SeekCompanyMax: 8,
  SeekCompanyVisible: 4,
  AccountTrainerCertificatesVisible: 3,
  TrainingPageVisible: 4,
} as const;

export const DISCOUNT = 0.1;

export const FormQueryParams = {
  TrainingsCatalogLimit: 12,
  UsersCatalogLimit: 12,
} as const;

export enum PlaceholderPath {
  Image = 'img/content/placeholder.png',
  CardForYou = 'img/content/thumbnails/preview-01',
  CardSpecial = 'img/content/thumbnails/nearest-gym-01',
}

export const SEND_NEWSLETTER_EMAIL_EVERY_SECONDS = 5;
