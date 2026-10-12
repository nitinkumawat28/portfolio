import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { About } from './About.tsx';
import { NotFound } from './NotFound.tsx';
import { siteData } from './data/site.ts';

export function RootRouter() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const normalizedPath = currentPath.replace(/\/+$/, '') || '/';

  // 1. Home / Root Desktop
  if (normalizedPath === '/' || normalizedPath === '/index.html') {
    return <App initialFolderId={null} />;
  }

  // 2. About page
  if (normalizedPath === '/about') {
    return <About />;
  }

  // 3. Folder routes: /folder/:folderId
  const folderMatch = normalizedPath.match(/^\/folder\/([^/]+)$/);
  if (folderMatch) {
    const folderId = folderMatch[1];
    const validFolderIds = siteData.folders.map((f) => f.id);
    if (validFolderIds.includes(folderId)) {
      return <App initialFolderId={folderId} />;
    }
    // Invalid folder ID -> 404
    return <NotFound path={currentPath} />;
  }

  // 4. Any other unrecognized URL -> 404
  return <NotFound path={currentPath} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootRouter />
  </StrictMode>,
);
