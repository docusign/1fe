import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { AppHeader } from '../components/header';
import { store } from '../store';

describe('App header', () => {
  const renderHeader = () => {
    return {
      // See https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent
      user: userEvent.setup(),
      ...render(
        // We can use a mock store here. for now using the real store for simplicity
        <Provider store={store}>
          <AppHeader />
        </Provider>,
      ),
    };
  };

  test('header actions have accessible names and roles', async () => {
    renderHeader();

    expect(
      screen.getByRole('button', { name: 'Widget switcher' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Widget props' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Render' })).toBeInTheDocument();
  });
});

export {};
