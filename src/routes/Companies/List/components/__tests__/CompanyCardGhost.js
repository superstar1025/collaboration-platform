import React from 'react';
import test from 'ava';

import CompanyCardGhost from '../CompanyCardGhost';

const { expect, shallow } = testHelper;

const testProps = {};

const shallowRenderer = (props = testProps) =>
  shallow(<CompanyCardGhost {...props} />);

test('Renders a Card', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Card');
});

test('Renders a CardHeader', () => {
  const component = shallowRenderer();
  expect(component).toContain('CardHeader');
});

test('Renders a CardBody', () => {
  const component = shallowRenderer();
  expect(component).toContain('CardHeader');
});

test('Renders a LoadingIndicator', () => {
  const component = shallowRenderer();
  expect(component).toContain('LoadingIndicator');
});
