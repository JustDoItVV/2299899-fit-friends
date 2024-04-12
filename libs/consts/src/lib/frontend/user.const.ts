import { Location } from '@2299899-fit-friends/types';

export const AUTH_TOKEN_KEY_NAME = 'X-token';
export const NAME_ERROR_CODES = [400];
export const EMAIL_ERROR_CODES = [400, 404, 409];
export const PASSWORD_ERROR_CODES = [400, 401];

export const LOCATIONS: Location[] = [
  {
    name: 'Пионерская',
    latitude: 60.002500000,
    longitude: 30.296666667,
  },
  {
    name: 'Петроградская',
    latitude: 59.966111111,
    longitude: 30.311666667,
  },
  {
    name: 'Удельная',
    latitude: 60.016666667,
    longitude: 30.315555556,
  },
  {
    name: 'Звёздная',
    latitude: 59.833055556,
    longitude: 30.349444444,
  },
  {
    name: 'Спортивная',
    latitude: 59.950277778,
    longitude: 30.288055556,
  }
];

export const MAP_ZOOM = 13;
