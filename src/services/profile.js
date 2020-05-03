import Promise from 'bluebird';

import * as request from './base';
import { delay } from '../utils';

export const me = async (params = {}) => {
  return request.get(`/profile/me`, {
    params,
    headers: {
      common: {
        Authorization: '',
      },
    },
  });
};

export const orders = async (params = {}) => {
  return request.get(`/profile/orders`, {
    params,
  });
};
