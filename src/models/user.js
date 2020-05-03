import axios from 'axios';

import { createAction, NavigationActions, Storage } from '../utils';
import * as authServices from '../services/auth';
import * as profileServices from '../services/profile';
import baseService from '../services/base';

export default {
  namespace: 'user',
  state: {
    isBusy: false,
    isAuthenticated: false,
    user: undefined,
    token: undefined,
    loginErrorMessage: undefined,
    orders: [],
    fetchOrderErrorMessage: undefined,
    isInitialized: false
  },
  reducers: {
    updateState(state, payload) {
      return { ...state, ...payload };
    },
  },
  effects: dispatch => ({
    async loadFromStorage() {
      console.log('Load user info from storage');

      this.updateState({
        isBusy: true,
      });

      try {
        const userData = await Storage.get('login', null);

        if (userData && userData.token) {
          const result = await profileServices.me({
            access_token: userData.token,
          });
          const user = result.data;
          const { token } = userData;

          baseService.defaults.headers.common.Authorization = `Bearer ${token}`;
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;

          this.updateState({
            isBusy: false,
            isAuthenticated: true,
            isInitialized: true,
            user,
            token,
          });
        } else {
          this.updateState({
            isBusy: false,
            isAuthenticated: false,
            user: undefined,
            token: undefined,
            isInitialized: true
          });
        }
      } catch (err) {
        this.updateState({
          isBusy: false,
          isAuthenticated: false,
          user: undefined,
          token: undefined,
          isInitialized: true,
        });

        // FIXME:: set to log server
        console.warn(err);
      }
    },

    async login(payload) {
      console.log('payload', payload);
      
      this.updateState({
        isBusy: true,
        loginErrorMessage: undefined,
      });
      try {
        const result = await authServices.login(payload);
        const { user, token } = result.data;

        baseService.defaults.headers.common.Authorization = `Bearer ${token}`;
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        await Storage.set('login', { user, token });

        this.updateState({
          isBusy: false,
          isAuthenticated: true,
          isInitialized: true,
          user,
          token,
        });
      } catch (err) {
        this.updateState({
          isBusy: false,
          isAuthenticated: false,
          isInitialized: true,
          user: undefined,
          token: undefined,
          errorMessage: err.message,
        });
      }
    },

    async logout(payload) {
      this.updateState({
        isBusy: true,
        loginErrorMessage: undefined,
      });

      const resetAll = async () => {
        baseService.defaults.headers.common.Authorization = ``;
        axios.defaults.headers.common.Authorization = ``;

        await Storage.set('login', null);

        this.updateState({
          isBusy: false,
          isAuthenticated: false,
          user: undefined,
          token: undefined,
        });

        dispatch({ type: 'cart/reset' });
      };

      try {
        // TODO:: call api logout
        // const result = await authServices.logout(payload);
        await resetAll();
      } catch (err) {
        // FIXME:: send error to sentry
        console.warn(err);

        await resetAll();
      }
    },
  }),
};
