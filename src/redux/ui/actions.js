import { createAction, createClearAction } from 'redux/redux-actions';
import {
  SET_BREADCRUMB_MENU,
  CLEAR_BREADCRUMB_MENU,
  SET_SIDEBAR_ITEMS,
  CLEAR_SIDEBAR_ITEMS,
  SET_HEADER_TITLE,
  CLEAR_HEADER_TITLE,
  SET_CONFIRM_MESSAGE,
  CLEAR_CONFIRM_MESSAGE,
} from 'redux/constants';

export const setBreadcrumbMenu = createAction(SET_BREADCRUMB_MENU);
export const clearBreadcrumbMenu = createClearAction(CLEAR_BREADCRUMB_MENU);

export const setSidebarItems = createAction(SET_SIDEBAR_ITEMS);
export const clearSidebarItems = createClearAction(CLEAR_SIDEBAR_ITEMS);

export const setHeaderTitle = createAction(SET_HEADER_TITLE);
export const clearHeaderTitle = createClearAction(CLEAR_HEADER_TITLE);

export const setConfirmMessage = createAction(SET_CONFIRM_MESSAGE);
export const clearConfirmMessage = createAction(CLEAR_CONFIRM_MESSAGE);
