import { platformProps } from '@devhub/1fe-shell';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { createStore } from './store';
import { WidgetProps } from './contract';

/**
 * Wrap the application code in the various app level providers
 */
export const withProvider = (Component: React.FC<WidgetProps>) =>
  function WidgetProvider(props: WidgetProps): React.ReactElement {
    // Create a new store for each instance of the widget
    // Automatically is destroyed when the widget is unmounted
    const [store] = useState(createStore);

    return (
      <Provider store={store}>
        <Component {...props} />
      </Provider>
    );
  };
