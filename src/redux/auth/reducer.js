import generateHandleActions from 'redux/state-handler';
import { SET_AUTH_TOKEN } from 'redux/constants';

const apiStates = [];
const instantStates = [
  { type: SET_AUTH_TOKEN, name: 'tokenInfo', kind: 'object' },
];
const storage = {
  tokenInfo: 'tokenInfo',
};
const listValues = [];

export default generateHandleActions({ apiStates, instantStates, storage, listValues });
