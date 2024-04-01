export const BACKEND_URL = 'http://localhost:3001/api';
export const REQUEST_TIMEOUT = 5000;

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
  SendNewTrainingsEmail = '/send-new-trainings-email',
  Notification = '/notification',
  Training = '/training',
  BackgroundPicture = '/background-picture',
  Video = '/video',
  Account = '/account',
  Trainer = '/trainer',
  Orders = '/orders',
  Reviews = '/reviews',
  TriningRequest = '/training-request',
}
