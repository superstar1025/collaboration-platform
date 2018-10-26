import React from 'react';
import test from 'ava';

import WordCloudsCard from '../WordCloudsCard';

const { expect, shallow } = testHelper;

const testProps = {
  title: 'test Title',
  words: ['word1', 'word2', 'word3'],
};

const shallowRenderer = (props = testProps) =>
  shallow(<WordCloudsCard {...props} />);

test('Renders a Card', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Card');
});

test('Renders 3 CardText', () => {
  const component = shallowRenderer();
  expect(component.find('CardText').length).toBe(3);
});
