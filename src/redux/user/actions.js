import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_USERS, CREATE_USER, UPDATE_USER, READ_USER, REMOVE_USER } from 'redux/constants';

const userApi = restApis('users');

export const listUsers = createApiAction(LIST_USERS, userApi.list);
export const createUser = createApiAction(CREATE_USER, userApi.create, { title: 'Success', detail: 'User is created successfully' });
export const readUser = createApiAction(READ_USER, userApi.read);
export const removeUser = createApiAction(REMOVE_USER, userApi.remove);
export const updateUser = createApiAction(UPDATE_USER, userApi.update, { title: 'Success', detail: 'You’ve successfully updated the user.' });
