import React from 'react';
import ReactDOM from 'react-dom';
import './globals.css';
import App from './App';

const setup = () => {
  console.log('setup hit');
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.querySelector('#root')
  );
  
}

setup();