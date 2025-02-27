import React, { useState, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { getRouter } from './components/Router';

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  // const LazyApp1 = React.lazy(() =>
  //   (window as any).System.import('@1ds/starter-kit'),
  // );
  // const LazyApp2 = React.lazy(() =>
  //   (window as any).System.import('@1ds/starter-kit2'),
  // );
  return (
    <RouterProvider router={getRouter()} />
  );
}

export default App;
