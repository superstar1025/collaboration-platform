import React from 'react';
import generateHandleActions from 'redux/state-handler';
import {
  SET_BREADCRUMB_MENU,
  CLEAR_BREADCRUMB_MENU,
  SET_SIDEBAR_ITEMS,
  CLEAR_SIDEBAR_ITEMS,
  GLOBAL_NOTIFICATION,
  SET_HEADER_TITLE,
  CLEAR_HEADER_TITLE,
  SET_CONFIRM_MESSAGE,
  CLEAR_CONFIRM_MESSAGE,
} from 'redux/constants';

const apiStates = [];
const instantStates = [
  { type: SET_BREADCRUMB_MENU, name: 'breadcrumbMenu', defaultValue: <div /> },
  { type: CLEAR_BREADCRUMB_MENU, name: 'breadcrumbMenu' },
  { type: SET_SIDEBAR_ITEMS, name: 'sidebarItems', kind: 'object' },
  { type: CLEAR_SIDEBAR_ITEMS, name: 'sidebarItems', kind: 'object' },
  { type: GLOBAL_NOTIFICATION, name: 'notification', kind: 'object' },
  { type: SET_HEADER_TITLE, name: 'headerTitle' },
  { type: CLEAR_HEADER_TITLE, name: 'headerTitle' },
  { type: SET_CONFIRM_MESSAGE, name: 'confirmMessage', kind: 'object' },
  { type: CLEAR_CONFIRM_MESSAGE, name: 'confirmMessage', kind: 'object' },
];
const listValues = ['sidebarItems'];

export default generateHandleActions({ apiStates, instantStates, listValues });
