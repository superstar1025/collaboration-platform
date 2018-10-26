import generateHandleActions from 'redux/state-handler';
import { LIST_SUB_TEAMS, CREATE_SUB_TEAM, READ_SUB_TEAM, REMOVE_SUB_TEAM } from 'redux/constants';

const apiStates = [
  { type: LIST_SUB_TEAMS, name: 'subTeams', apiField: 'data' },
  { type: CREATE_SUB_TEAM, name: 'createSubTeam' },
  { type: READ_SUB_TEAM, name: 'subTeam', apiField: 'data', clear: true },
  { type: REMOVE_SUB_TEAM, name: 'removeSubTeam' },
];

const instantStates = [];

const listValues = ['subTeams'];

export default generateHandleActions({ apiStates, instantStates, listValues });
