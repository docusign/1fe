import React, { useState, Suspense } from 'react';
import logo from './logo.svg';
import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Welcome from './components/Welcome/Welcome';

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);
  const LazyApp1 = React.lazy(() =>
    (window as any).System.import('@1ds/starter-kit'),
  );
  const LazyApp2 = React.lazy(() =>
    (window as any).System.import('@1ds/starter-kit2'),
  );
  return (
    <Router>
      <div className={styles.App}>
        <header className={styles['App-header']}>
          <img src={logo} className={styles['App-logo']} alt='logo' />
          <Welcome />
          <Suspense fallback={<div>Loading...</div>}>
            <LazyApp1 />
            <LazyApp2 />
          </Suspense>
          <p>
            <button onClick={() => setCount((count) => count + 1)}>
              count is: {count}
            </button>
          </p>
          <p>
            Edit <code>App.tsx</code> and save to test HMR updates56.
          </p>
          <p>
            <a
              className={styles['App-link']}
              href='https://reactjs.org'
              target='_blank'
              rel='noopener noreferrer'
            >
              Learn React
            </a>
            {' | '}
            <a
              className={styles['App-link']}
              href='https://vitejs.dev/guide/features.html'
              target='_blank'
              rel='noopener noreferrer'
            >
              Vite Docs
            </a>
          </p>
          <Switch>
            <Route path='/about'>
              <main>About</main>
            </Route>
            <Route path='/'>
              <main>Home</main>
            </Route>
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
