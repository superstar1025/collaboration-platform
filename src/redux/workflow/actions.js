import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_WORKFLOWS, READ_WORKFLOW, CREATE_WORKFLOW, UPDATE_WORKFLOW, REMOVE_WORKFLOW } from 'redux/constants';

const workflowApi = restApis('projects', 'workflows');

export const listWorkflows = createApiAction(LIST_WORKFLOWS, workflowApi.list);
export const createWorkflow = createApiAction(CREATE_WORKFLOW, workflowApi.create, { title: 'Success', detail: 'Workflow is created successfully' });
export const updateWorkflow = createApiAction(UPDATE_WORKFLOW, workflowApi.update);
export const readWorkflow = createApiAction(READ_WORKFLOW, workflowApi.read);
export const removeWorkflow = createApiAction(REMOVE_WORKFLOW, workflowApi.remove);
