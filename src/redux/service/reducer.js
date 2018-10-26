import generateHandleActions from 'redux/state-handler';
import { LIST_SERVICES, CREATE_SERVICE, READ_SERVICE, UPDATE_SERVICE, REMOVE_SERVICE } from 'redux/constants';

const apiStates = [
  { type: LIST_SERVICES, name: 'services', apiField: 'data' },
  { type: CREATE_SERVICE, name: 'createService', apiField: 'data' },
  { type: READ_SERVICE, name: 'service', apiField: 'data', clear: true },
  { type: UPDATE_SERVICE, name: 'service', apiField: 'data' },
  { type: REMOVE_SERVICE, name: 'removeService' },
];

const instantStates = [];

const listValues = ['services'];

export default generateHandleActions({ apiStates, instantStates, listValues });
