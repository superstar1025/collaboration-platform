import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';
import Auth0 from 'auth0-js';
import moment from 'moment';

import { AuthorizationHandler } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  tokenInfo: fromJS({}),
  children: <div>test children</div>,
  location: {},
};

const shallowRenderer = (props = testProps) =>
  shallow(<AuthorizationHandler {...props} />);

test('calls authorize of Auth when tokenInfo is not valid.', () => {
  const authorize = createSpy();
  Auth0.WebAuth = class WebAuth {
    authorize = () => authorize()
  };
  shallowRenderer();
  expect(authorize).toHaveBeenCalled();
});

test('does not call authorize of Auth when tokenInfo is valid.', () => {
  const authorize = createSpy();
  Auth0.WebAuth = class WebAuth {
    authorize = () => authorize()
  };
  shallowRenderer({
    ...testProps,
    tokenInfo: fromJS({
      id_token: 'test token',
      expires: moment().unix() + 100,
    }),
  });
  expect(authorize).toNotHaveBeenCalled();
});
