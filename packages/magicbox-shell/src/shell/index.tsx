import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './globals.css';

const renderMagicBoxShell = (options: any) => {
    console.log('renderMagicBoxShell hit');
    ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.querySelector('#root'),
      );
}

export default renderMagicBoxShell;