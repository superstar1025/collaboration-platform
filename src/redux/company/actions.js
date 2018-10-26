import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_COMPANIES, CREATE_COMPANY, READ_COMPANY, UPDATE_COMPANY, REMOVE_COMPANY } from 'redux/constants';

const companiesApi = restApis('companies');

export const listCompanies = createApiAction(LIST_COMPANIES, companiesApi.list);
export const createCompany = createApiAction(CREATE_COMPANY, companiesApi.create, { title: 'Success', detail: 'Company is created successfully' });
export const updateCompany = createApiAction(UPDATE_COMPANY, companiesApi.update, { title: 'Success', detail: 'Company is updated successfully' });
export const readCompany = createApiAction(READ_COMPANY, companiesApi.read);
export const removeCompany = createApiAction(REMOVE_COMPANY, companiesApi.remove);
