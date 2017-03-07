import React from 'react';
import renderer from 'react-test-renderer';
import { StateContainer } from 'cerebral/react';

import NewTodo from '.';

describe('NewTodo component', () => {
  it('renders a form', () => {
    const state = { app: { newTodoTitle: 'Test title' } };
    const tree = renderer.create(<StateContainer state={state}><NewTodo /></StateContainer>);
    expect(tree).toMatchSnapshot();
  });
});
