import generateHandleActions from 'redux/state-handler';
import { LIST_MEMBERS, CREATE_MEMBER, READ_MEMBER, REMOVE_MEMBER } from 'redux/constants';

const apiStates = [
  { type: LIST_MEMBERS, name: 'members', apiField: 'data' },
  { type: CREATE_MEMBER, name: 'createMember' },
  { type: READ_MEMBER, name: 'member', apiField: 'data', clear: true },
  { type: REMOVE_MEMBER, name: 'removeMember' },
];

const instantStates = [];

const listValues = ['members'];

export default generateHandleActions({ apiStates, instantStates, listValues });
