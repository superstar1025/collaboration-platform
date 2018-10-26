import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_SERVICES, READ_SERVICE, CREATE_SERVICE, UPDATE_SERVICE, REMOVE_SERVICE } from 'redux/constants';

const serviceApi = restApis('users', 'services');

export const listServices = createApiAction(LIST_SERVICES, serviceApi.list);
export const createService = createApiAction(CREATE_SERVICE, serviceApi.create, { title: 'Success', detail: 'Service is created successfully' });
export const updateService = createApiAction(UPDATE_SERVICE, serviceApi.update, { title: 'Success', detail: 'Service is updated successfully' });
export const readService = createApiAction(READ_SERVICE, serviceApi.read);
export const removeService = createApiAction(REMOVE_SERVICE, serviceApi.remove);
