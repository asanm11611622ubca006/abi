import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIX: Add global type definition for 'ion-icon' here to ensure it is picked up by TypeScript.
// This is required because 'ion-icon' is a custom element (Web Component) not known to React's JSX types by default.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': any;
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);