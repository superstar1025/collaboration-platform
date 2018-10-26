import { combineReducers } from 'redux-immutable';
import { routerReducer } from 'react-router-redux';

import ui from 'redux/ui/reducer';
import auth from 'redux/auth/reducer';
import project from 'redux/project/reducer';
import keyword from 'redux/keyword/reducer';
import negativeKeyword from 'redux/negative_keyword/reducer';
import filterType from 'redux/filter_type/reducer';
import segment from 'redux/segment/reducer';
import workflow from 'redux/workflow/reducer';
import user from 'redux/user/reducer';
import service from 'redux/service/reducer';
import company from 'redux/company/reducer';
import team from 'redux/team/reducer';
import member from 'redux/member/reducer';
import agentType from 'redux/agent_type/reducer';
import teamProjects from 'redux/teamProjects/reducer';
import subTeam from 'redux/subTeam/reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  ui,
  auth,
  user,
  project,
  keyword,
  negativeKeyword,
  segment,
  workflow,
  filterType,
  service,
  company,
  team,
  member,
  agentType,
  teamProjects,
  subTeam,
});

export default rootReducer;
