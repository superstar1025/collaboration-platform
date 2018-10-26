import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';
import { noop } from 'lodash';
import base64 from 'base-64';

import { Callback } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  tokenInfo: fromJS({}),
  setAuthToken: noop,
  location: { hash: '' },
};

const shallowRenderer = (props = testProps) =>
  shallow(<Callback {...props} />);

test('renders null by default.', () => {
  const component = shallowRenderer();
  expect(component.type()).toBe(null);
});

test('setAuthToken is called when there is id_token.', () => {
  const setAuthToken = createSpy();
  shallowRenderer({
    ...testProps,
    location: { hash: `#id_token=test.${base64.encode('{}')}.whatever` },
    setAuthToken,
  });
  expect(setAuthToken).toHaveBeenCalled();
});

test('redirects when access_token is matching to stored one.', () => {
  const accessToken = 'test_access_token';
  const component = shallowRenderer();
  // still it's not matching after run following
  component.setProps({ location: { hash: `#id_token=${accessToken}` } });
  expect(component).toNotContain('Redirect');
  // it's matching after it runs the following so Redirect is included.
  component.setProps({ tokenInfo: fromJS({ id_token: accessToken }) });
  expect(component).toContain('Redirect');
});
