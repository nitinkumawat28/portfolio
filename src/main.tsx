import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Admin } from './Admin.tsx'
import { About } from './About.tsx'

const path = window.location.pathname;
const isAdmin = path === '/admin'
const isAbout = path === '/about'
const folderMatch = path.match(/^\/folder\/([^/]+)$/)
const folderId = folderMatch ? folderMatch[1] : null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? <Admin /> : 
     isAbout ? <About /> : 
     <App initialFolderId={folderId} />}
  </StrictMode>,
)
