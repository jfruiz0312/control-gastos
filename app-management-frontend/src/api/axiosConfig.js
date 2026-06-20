import axios from 'axios';

const httpHandlers = {
  onRequestStart: () => undefined,
  onRequestEnd: () => undefined,
  onError: () => undefined,
};

export const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
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
