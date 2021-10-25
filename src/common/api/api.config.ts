import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import Qs from 'qs';
import { configs } from '@config';
import { Auth } from 'aws-amplify';

const { API_URL, VERSION } = configs;

type FailedQueueData = {
  resolve: (val: unknown) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueData[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

interface OriginalAxiosRequestConfig extends AxiosRequestConfig {
  _retry: boolean;
}

const refreshInterceptor = (axiosInstance: AxiosInstance) => (error: AxiosError) => {
  const _axios = axiosInstance;
  const originalRequest = error.config as OriginalAxiosRequestConfig;
  if (error.response?.status === 401 && !originalRequest._retry && error.response?.data?.error !== 'Pundit Error') {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return _axios.request(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise((resolve, reject) => {
      Auth.currentSession()
        .then((user) => {
          const jwtToken = user.getAccessToken().getJwtToken();
          _axios.defaults.headers.common.Authorization = `Bearer ${jwtToken}`;
          originalRequest.headers.Authorization = `Bearer ${jwtToken}`;
          processQueue(null, jwtToken);
          resolve(_axios(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        });
    });
  }

  return Promise.reject(error);
};

const headerTokenConfig = async (config: AxiosRequestConfig) => {
  try {
    
    const cognitoSession = await Auth.currentSession();
    config.headers.Authorization = `Bearer ${cognitoSession.getAccessToken().getJwtToken()}`;
    return config;
  } catch (error) {
    delete config.headers.Authorization;
    return config;
  }
};

axios.defaults.paramsSerializer = (params) =>
  Qs.stringify(params, {
    arrayFormat: 'brackets', //! !params.q ? "brackets" : "indices"
  });

const headerConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Version': `v${VERSION}`,
  },
};

const PlainAPI = axios.create(headerConfig);
const API = axios.create(headerConfig);

API.interceptors.request.use(headerTokenConfig, (error) => Promise.reject(error));
API.interceptors.response.use(undefined, refreshInterceptor(API));

export { PlainAPI, API, API_URL, VERSION };
