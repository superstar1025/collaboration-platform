import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_AGENT_TYPES } from 'redux/constants';

const agentTypeApi = restApis('projects', 'workflows/agent_types');

export const listAgentTypes = createApiAction(LIST_AGENT_TYPES, agentTypeApi.list);
