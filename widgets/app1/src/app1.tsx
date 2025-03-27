import { platformProps } from '@devhub/1fe-shell';
import React, { useEffect } from 'react';
import { default as Widget } from './components/router';
import withProvider from './withProvider';

// export default function Root() {
//   return <p>My component from app1 is mounted! Hello world</p>;
// }
const RootWrapper = () => {
  useEffect(() => {
    platformProps.utils.appLoadTime.end();
  }, []);

  return <Widget />;
};

export default withProvider(RootWrapper);
