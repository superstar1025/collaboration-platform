/* istanbul ignore file */
import { createSelector } from 'reselect';
import { getSelector } from 'redux/selectors';

export const currentUserSelector =
  createSelector(getSelector('auth', 'tokenInfo'), state => state.get('currentUser'));

export const accessTokenSelector =
  createSelector(getSelector('auth', 'tokenInfo'), state => state.get('id_token'));
