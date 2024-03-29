export const BACKEND_URL = 'http://localhost:3001/api';
export const REQUEST_TIMEOUT = 5000;

export enum ApiRoute {
  User = '/user',
  Register = '/register',
  Login = '/login',
  Check = '/check',
  Refresh = '/refresh',
  Guitars = '/guitars',
  GuitarPhoto = '/photo',
}
