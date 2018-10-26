import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_MEMBERS, CREATE_MEMBER, READ_MEMBER, REMOVE_MEMBER, UPDATE_MEMBER } from 'redux/constants';

const memberApi = restApis('companies', 'teams', 'members');

export const listMembers = createApiAction(LIST_MEMBERS, memberApi.list);
export const readMember = createApiAction(READ_MEMBER, memberApi.read);
export const removeMember = createApiAction(REMOVE_MEMBER, memberApi.remove);
export const createMember = createApiAction(
  CREATE_MEMBER, memberApi.create, { title: 'Success', detail: 'You’ve successfully created the member.' },
);
export const updateMember = createApiAction(UPDATE_MEMBER, memberApi.update, { title: 'Success', detail: 'You’ve successfully updated the member.' });
