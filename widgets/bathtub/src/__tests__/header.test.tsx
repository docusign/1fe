import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { AppHeader } from '../components/header';
import { store } from '../store';

describe('App header', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Use this to override the shell platformProps
    // (oneDsShell as MockShell).setup({
    //   environment: 'integration',
    // });
  });

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

    // const docsLink = screen.getByRole('link', { name: '1DS Docs' });
    // const helpLink = screen.getByRole('link', { name: 'Help' });
    // expect(
    //   screen.getByRole('button', { name: 'Widget props' }),
    // ).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: 'Render' })).toBeInTheDocument();

    // // Links are set to open in a new window
    // expect(docsLink).toHaveAttribute('target', '_blank');
    // expect(helpLink).toHaveAttribute('target', '_blank');
  });
});

export {};
