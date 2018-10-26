import generateHandleActions from 'redux/state-handler';
import { LIST_USERS, CREATE_USER, READ_USER, REMOVE_USER } from 'redux/constants';

const apiStates = [
  { type: LIST_USERS, name: 'users', apiField: 'data' },
  { type: READ_USER, name: 'user', apiField: 'data', clear: true },
  { type: CREATE_USER, name: 'createUser', append: 'users', apiField: 'data' },
  { type: REMOVE_USER, name: 'removeUser' },
];

const instantStates = [];

const listValues = ['users'];

export default generateHandleActions({ apiStates, instantStates, listValues });
