import { createAction, createClearAction } from 'redux/redux-actions';
import { SET_AUTH_TOKEN } from '../constants';

export const setAuthToken = createAction(SET_AUTH_TOKEN);
export const clearAuthToken = createClearAction(SET_AUTH_TOKEN);
