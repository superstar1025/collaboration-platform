import generateHandleActions from 'redux/state-handler';
import { LIST_FILTER_TYPES, READ_FILTER_TYPE } from 'redux/constants';

const apiStates = [
  { type: LIST_FILTER_TYPES, name: 'filterTypes', apiField: 'data' },
  { type: READ_FILTER_TYPE, name: 'filterType', apiField: 'data' },
];

const instantStates = [];

const listValues = ['filterTypes'];

export default generateHandleActions({ apiStates, instantStates, listValues });
