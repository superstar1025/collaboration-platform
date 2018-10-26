import React from 'react';
import test from 'ava';
import { noop } from 'lodash';
import { fromJS } from 'immutable';
import { toast } from 'react-toastify';

import { Notification } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  formatMessage: noop,
  notification: fromJS({}),
};

const shallowRenderer = (props = testProps) =>
  shallow(<Notification {...props} />);

test('Renders a ToastContainer', () => {
  const component = shallowRenderer();
  expect(component).toBeA('ToastContainer');
});

test('state `kind` changes and toast is fired when notification is changed', () => {
  const component = shallowRenderer();
  const notification = fromJS({
    kind: 'success',
    data: {
      title: 'Whatever',
      detail: 'detailed description',
    },
  });
  toast.success = createSpy();
  expect(component).toHaveState({ kind: 'default' });
  component.setProps({ notification });
  expect(component).toHaveState({ kind: 'success' });
  expect(toast.success).toHaveBeenCalled();
});

test('state `kind` changes and toast is fired when notification is changed', () => {
  const component = shallowRenderer();
  // success
  let notification = fromJS({
    kind: 'success',
    data: [
      {
        title: 'Whatever',
        detail: 'detailed description',
      },
      {
        title: 'Whatever', // checks if it works without details.
      },
    ],
  });
  toast.success = createSpy();
  expect(component).toHaveState({ kind: 'default' });
  component.setProps({ notification });
  expect(component).toHaveState({ kind: 'success' });
  expect(toast.success).toHaveBeenCalled();

  // warning
  notification = fromJS({
    kind: 'warning',
    data: [{
      title: 'Whatever',
      detail: 'detailed description',
    }],
  });

  toast.warn = createSpy();
  component.setProps({ notification });
  expect(component).toHaveState({ kind: 'warning' });
  expect(toast.warn).toHaveBeenCalled();
});

test('state `kind` does not change when props changed but not notification', () => {
  const component = shallowRenderer();
  component.setProps({ formatMessage: () => 'something' });
  expect(component).toHaveState({ kind: 'default' });
});
