import React from 'react';
import test from 'ava';

import LoadingIndicator, { styles } from '../index';

const { expect, shallow } = testHelper;

const testProps = {};

const shallowRenderer = (props = testProps) =>
  shallow(<LoadingIndicator {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Applies small style', () => {
  const component = shallowRenderer({
    size: 'small',
  });
  expect(component).toHaveProps({ style: styles.small });
});
