import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import './styles/index.css';

const root = document.getElementById('react-builder-root');
if (root) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root
  );
}
