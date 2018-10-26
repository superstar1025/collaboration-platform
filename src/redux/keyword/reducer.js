import generateHandleActions from 'redux/state-handler';
import { LIST_KEYWORDS, CREATE_KEYWORDS, READ_KEYWORD, REMOVE_KEYWORD, REMOVE_MULTIPLE_KEYWORDS } from 'redux/constants';

const apiStates = [
  { type: LIST_KEYWORDS, name: 'keywords', apiField: 'data' },
  { type: CREATE_KEYWORDS, name: 'createKeywords' },
  { type: READ_KEYWORD, name: 'keyword', apiField: 'data', clear: true },
  { type: REMOVE_KEYWORD, name: 'removeKeyword' },
  { type: REMOVE_MULTIPLE_KEYWORDS, name: 'removeKeyword' },
];

const instantStates = [];

const listValues = ['keywords'];

export default generateHandleActions({ apiStates, instantStates, listValues });
