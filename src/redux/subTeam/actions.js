import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_SUB_TEAMS, CREATE_SUB_TEAM, READ_SUB_TEAM, REMOVE_SUB_TEAM, UPDATE_SUB_TEAM } from 'redux/constants';

const subTeamsApi = restApis('companies', 'teams', 'team');

export const listSubTeams = createApiAction(LIST_SUB_TEAMS, subTeamsApi.list);
export const readSubTeam = createApiAction(READ_SUB_TEAM, subTeamsApi.read);
export const removeSubTeam = createApiAction(REMOVE_SUB_TEAM, subTeamsApi.remove);
export const createSubTeam = createApiAction(
  CREATE_SUB_TEAM, subTeamsApi.create, { title: 'Success', detail: 'You’ve successfully created the project.' },
);
export const updateSubTeam = createApiAction(UPDATE_SUB_TEAM, subTeamsApi.update, { title: 'Success', detail: 'You’ve successfully updated the project.' });
