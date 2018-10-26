import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_FILTER_TYPES, READ_FILTER_TYPE } from 'redux/constants';

const filterTypeApi = restApis('projects', 'segments/filters');

export const listFilterTypes = createApiAction(LIST_FILTER_TYPES, filterTypeApi.list);
export const readFilterType = createApiAction(READ_FILTER_TYPE, filterTypeApi.read);
