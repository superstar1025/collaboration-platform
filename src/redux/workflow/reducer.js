import generateHandleActions from 'redux/state-handler';
import { LIST_WORKFLOWS, CREATE_WORKFLOW, READ_WORKFLOW, UPDATE_WORKFLOW, REMOVE_WORKFLOW } from 'redux/constants';

const apiStates = [
  { type: LIST_WORKFLOWS, name: 'workflows', apiField: 'data' },
  { type: CREATE_WORKFLOW, name: 'createWorkflow', apiField: 'data' },
  { type: READ_WORKFLOW, name: 'workflow', apiField: 'data', clear: true },
  { type: UPDATE_WORKFLOW, name: 'workflow', apiField: 'data', update: 'workflows' },
  { type: REMOVE_WORKFLOW, name: 'removeWorkflow' },
];

const instantStates = [];

const listValues = ['workflows'];

export default generateHandleActions({ apiStates, instantStates, listValues });
