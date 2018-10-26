import generateHandleActions from 'redux/state-handler';
import { LIST_TEAM_ROLES } from 'redux/constants';

const apiStates = [
  { type: LIST_TEAM_ROLES, name: 'teamRoles', apiField: 'data.attributes' },
];

const instantStates = [];

const listValues = [];

export default generateHandleActions({ apiStates, instantStates, listValues });
