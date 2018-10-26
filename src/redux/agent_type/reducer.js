import generateHandleActions from 'redux/state-handler';
import { LIST_AGENT_TYPES } from 'redux/constants';

const apiStates = [
  { type: LIST_AGENT_TYPES, name: 'agentTypes', apiField: 'data.attributes' },
];

const instantStates = [];

const listValues = [];

export default generateHandleActions({ apiStates, instantStates, listValues });
