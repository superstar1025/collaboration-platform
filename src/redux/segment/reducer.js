import generateHandleActions from 'redux/state-handler';
import { LIST_SEGMENTS, CREATE_SEGMENT, READ_SEGMENT, UPDATE_SEGMENT, REMOVE_SEGMENT } from 'redux/constants';

const apiStates = [
  { type: LIST_SEGMENTS, name: 'segments', apiField: 'data' },
  { type: CREATE_SEGMENT, name: 'createSegment', apiField: 'data' },
  { type: READ_SEGMENT, name: 'segment', apiField: 'data', clear: true },
  { type: UPDATE_SEGMENT, name: 'segment', apiField: 'data' },
  { type: REMOVE_SEGMENT, name: 'removeSegment' },
];

const instantStates = [];

const listValues = ['segments'];

export default generateHandleActions({ apiStates, instantStates, listValues });
