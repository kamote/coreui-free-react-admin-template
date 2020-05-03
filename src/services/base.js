import axios from 'axios';
import qs from 'qs';

import * as apiConfig from '../config/api';

const { BASE_URI } = apiConfig;

const instance = axios.create({
  baseURL: BASE_URI,
  timeout: 1000,
  headers: { 'X-Api-Key': 'not4everyone' },
});

export default instance;

export const post = async (url, { payload = {} }, passConfig = {}) => {
  const config = {
    method: 'POST',
    url,
    paramsSerializer: qs.stringify,
    data: payload,
    ...passConfig,
  };

  return instance(config).then(parseResponse);
};

export const get = async (url, { params = {} }, passConfig = {}) => {
  const config = {
    method: 'GET',
    url,
    paramsSerializer: qs.stringify,
    params,
    ...passConfig,
  };

  return instance(config).then(parseResponse);
};

function parseResponse(response) {
  return response.data;
}
