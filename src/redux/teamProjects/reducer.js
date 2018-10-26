import generateHandleActions from 'redux/state-handler';
import { LIST_TEAM_PROJECTS, CREATE_TEAM_PROJECT, READ_TEAM_PROJECT, REMOVE_TEAM_PROJECT } from 'redux/constants';

const apiStates = [
  { type: LIST_TEAM_PROJECTS, name: 'teamProjects', apiField: 'data' },
  { type: CREATE_TEAM_PROJECT, name: 'createteamProject' },
  { type: READ_TEAM_PROJECT, name: 'teamProject', apiField: 'data', clear: true },
  { type: REMOVE_TEAM_PROJECT, name: 'removeteamProject' },
];

const instantStates = [];

const listValues = ['teamProjects'];

export default generateHandleActions({ apiStates, instantStates, listValues });
