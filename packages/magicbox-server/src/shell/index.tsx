import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export const renderMagicBoxShell = (options: any) => {
  console.log('renderMagicBoxShell hit');
  // setMagicBoxConfigs(options);

  // TODO: Init utils if needed?
  
  ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.querySelector('#root'),
    )
}