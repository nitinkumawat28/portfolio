import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { About } from './About.tsx'

const path = window.location.pathname;
const isAbout = path === '/about'
const folderMatch = path.match(/^\/folder\/([^/]+)$/)
const folderId = folderMatch ? folderMatch[1] : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAbout ? <About /> : <App initialFolderId={folderId} />}
  </StrictMode>,
)
