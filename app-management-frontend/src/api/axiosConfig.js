import axios from 'axios';
import { getAccessToken } from '../utils/auth';

const httpHandlers = {
  onRequestStart: () => undefined,
  onRequestEnd: () => undefined,
  onError: () => undefined,
};

const authHandlers = {
  onUnauthorized: () => undefined,
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken && config?.meta?.skipAuth !== true) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    httpHandlers.onRequestStart(config);
    return config;
  },
  (error) => {
    httpHandlers.onError(error, error?.config);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    httpHandlers.onRequestEnd(response.config);
    return response;
  },
  (error) => {
    httpHandlers.onRequestEnd(error?.config);

    if (error?.response?.status === 401 && error?.config?.meta?.skipAuthRedirect !== true) {
      authHandlers.onUnauthorized(error);
    }

    httpHandlers.onError(error, error?.config);
    return Promise.reject(error);
  },
);

export function registerHttpHandlers(handlers = {}) {
  Object.assign(httpHandlers, handlers);

  return () => {
    httpHandlers.onRequestStart = () => undefined;
    httpHandlers.onRequestEnd = () => undefined;
    httpHandlers.onError = () => undefined;
  };
}

export function registerAuthHandlers(handlers = {}) {
  Object.assign(authHandlers, handlers);

  return () => {
    authHandlers.onUnauthorized = () => undefined;
  };
}
