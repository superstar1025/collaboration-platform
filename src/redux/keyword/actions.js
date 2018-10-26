import { createApiAction } from 'redux/redux-actions';
import restApis from 'redux/restApis';
import { LIST_KEYWORDS, CREATE_KEYWORDS, READ_KEYWORD, REMOVE_KEYWORD, REMOVE_MULTIPLE_KEYWORDS } from 'redux/constants';

const keywordApi = restApis('projects', 'keywords');

export const listKeywords = createApiAction(LIST_KEYWORDS, keywordApi.list);
export const readKeyword = createApiAction(READ_KEYWORD, keywordApi.read);
export const removeKeyword = createApiAction(REMOVE_KEYWORD, keywordApi.remove);
export const removeMultipleKeywords = createApiAction(
  REMOVE_MULTIPLE_KEYWORDS, keywordApi.multiRemove,
);
export const createKeywords = createApiAction(
  CREATE_KEYWORDS, keywordApi.create, { title: 'Success', detail: 'Keywords are created successfully' },
);
