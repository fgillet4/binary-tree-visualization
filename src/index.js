/**
 * index.js
 * Entry point for the application
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/App.css';
import './styles/TreeVisualization.css';
import './styles/Controls.css';
import './styles/InfoPanel.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);