import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { BACKEND_URL, REQUEST_TIMEOUT } from '@2299899-fit-friends/consts';

import { getToken } from './token';

export const createApiService = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
    withCredentials: true,
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  });

  return api;
};
