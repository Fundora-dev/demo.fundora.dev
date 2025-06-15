import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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

// パララックス背景制御
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const bg = document.getElementById('parallax-bg');
  if (bg) {
    bg.style.backgroundPosition = `center ${-y * 0.3}px`;
  }
});
