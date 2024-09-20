import './index.css';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { SlateProvider } from 'slate-ui';

import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <SlateProvider>
      <App />
    </SlateProvider>
  </React.StrictMode>
);
