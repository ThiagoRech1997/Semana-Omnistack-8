/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../src';

import ReactTestRenderer from 'react-test-renderer';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
