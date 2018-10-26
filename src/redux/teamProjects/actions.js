import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_TEAM_PROJECTS, CREATE_TEAM_PROJECT, READ_TEAM_PROJECT, REMOVE_TEAM_PROJECT, UPDATE_TEAM_PROJECT } from 'redux/constants';

const teamProjectsApi = restApis('companies', 'teams', 'project');

export const listTeamProjects = createApiAction(LIST_TEAM_PROJECTS, teamProjectsApi.list);
export const readTeamProject = createApiAction(READ_TEAM_PROJECT, teamProjectsApi.read);
export const removeTeamProject = createApiAction(REMOVE_TEAM_PROJECT, teamProjectsApi.remove);
export const createTeamProject = createApiAction(
  CREATE_TEAM_PROJECT, teamProjectsApi.create, { title: 'Success', detail: 'You’ve successfully created the project.' },
);
export const updateTeamProject = createApiAction(UPDATE_TEAM_PROJECT, teamProjectsApi.update, { title: 'Success', detail: 'You’ve successfully updated the project.' });
