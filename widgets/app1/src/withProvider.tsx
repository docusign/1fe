import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, UNSAFE_LocationContext } from 'react-router-dom';

import { createStore } from './store';

/**
 * Wrap the application code in the various app level providers
 */
// TODO: strongly type
const withProvider = (Component: React.FC<any>) =>
  function WidgetProvider(props: any): any {
    // Create a new store for each instance of the widget
    // Automatically is destroyed when the widget is unmounted
    const [store] = useState(createStore);

    return (
    <Provider store={store}> 
        {/* @ts-ignore */}
        <UNSAFE_LocationContext.Provider value={null}>
          <MemoryRouter
              initialEntries={[props.platform.utils.navigation.getRoute()]}
          >
            <Component {...props} />
          </MemoryRouter>
        </UNSAFE_LocationContext.Provider>
    </Provider>
    );
  };

export default withProvider;
