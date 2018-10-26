import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_TEAMS, CREATE_TEAM, READ_TEAM, REMOVE_TEAM, UPDATE_TEAM } from 'redux/constants';

const teamApi = restApis('companies', 'teams');

export const listTeams = createApiAction(LIST_TEAMS, teamApi.list);
export const readTeam = createApiAction(READ_TEAM, teamApi.read);
export const removeTeam = createApiAction(REMOVE_TEAM, teamApi.remove);
export const createTeam = createApiAction(
  CREATE_TEAM, teamApi.create, { title: 'Success', detail: 'You’ve successfully created the team.' },
);
export const updateTeam = createApiAction(UPDATE_TEAM, teamApi.update, { title: 'Success', detail: 'You’ve successfully updated the team.' });
