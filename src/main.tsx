
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Disabled service worker registration until we have a proper sw.js file
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js', { scope: '/' })
//       .then(registration => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch(error => {
//         console.error('Service Worker registration failed:', error);
//       });
//   });
// }

createRoot(document.getElementById("root")!).render(<App />);
