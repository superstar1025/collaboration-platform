import generateHandleActions from 'redux/state-handler';
import { LIST_COMPANIES, CREATE_COMPANY, READ_COMPANY, UPDATE_COMPANY, REMOVE_COMPANY } from 'redux/constants';

const apiStates = [
  { type: LIST_COMPANIES, name: 'companies', apiField: 'data' },
  { type: CREATE_COMPANY, name: 'createCompany', apiField: 'data' },
  { type: READ_COMPANY, name: 'company', apiField: 'data', clear: true },
  { type: UPDATE_COMPANY, name: 'company', apiField: 'data' },
  { type: REMOVE_COMPANY, name: 'removeCompany' },
];

const instantStates = [];

const listValues = ['companies'];

export default generateHandleActions({ apiStates, instantStates, listValues });
