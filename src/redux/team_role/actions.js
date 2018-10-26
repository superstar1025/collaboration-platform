import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_TEAM_ROLES } from 'redux/constants';

const teamRoleApi = restApis('companies', 'teams/roles');

export const listTeamRoles = createApiAction(LIST_TEAM_ROLES, teamRoleApi.list);
