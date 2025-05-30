import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import { setupMermaid } from './utils/mermaidSetup'

// Initialize mermaid.js globally
setupMermaid();

// Mount the app with StrictMode for better development experience
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
