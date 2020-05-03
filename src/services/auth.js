import Promise from 'bluebird';

import * as request from './base';
import { delay } from '../utils';

export const login = async (payload = {}) => {
  return request.post(`/auth/login`, {
    payload,
  });
};

export const logout = async (payload = {}) => {
  return request.post(`/auth/logout`, {
    payload,
  });
};
