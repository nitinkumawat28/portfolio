import { useState, useRef, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { StickyNote } from './components/desktop/StickyNote';
import { PostCard } from './components/desktop/PostCard';
import { ClockWidget } from './components/desktop/ClockWidget';
import { Folder } from './components/desktop/Folder';
import { PdfFile } from './components/desktop/PdfFile';
import { ChatBar } from './components/desktop/ChatBar';
import { FolderOverlay } from './components/desktop/FolderOverlay';
import { FloatingNumbers } from './components/background/FloatingNumbers';
import { siteData } from './data/site';

interface AppProps {
  initialFolderId?: string | null;
}

function App({ initialFolderId = null }: AppProps) {
  const [openFolderId, setOpenFolderId] = useState<string | null>(initialFolderId);
  const [topZ, setTopZ] = useState(10);
  const constraintsRef = useRef<HTMLElement>(null);

  const [pdfUrl] = useState<string>(() => {
    const rawUrl = siteData.customPdfBase64;
    if (rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('data:application/pdf')) {
      try {
        const arr = rawUrl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        return URL.createObjectURL(blob);
      } catch (e) {
        console.error('Failed to parse PDF data URI', e);
        return '/resume.pdf';
      }
    }
    return '/resume.pdf';
  });

  useEffect(() => {
    return () => {
      if (pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/^\/folder\/([^/]+)$/);
      setOpenFolderId(match ? match[1] : null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const bringToFront = () => setTopZ(z => z + 1);

  const handleOpenFolder = (id: string) => {
    setOpenFolderId(id);
    if (window.location.pathname !== `/folder/${id}`) {
      window.history.pushState(null, '', `/folder/${id}`);
    }
  };

  const handleCloseFolder = () => {
    setOpenFolderId(null);
    if (window.location.pathname.startsWith('/folder/')) {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--color-brand-bg)]">
      {/* Floating Numbers Animated Background - paused when folder overlay is open for maximum responsiveness */}
      <FloatingNumbers paused={Boolean(openFolderId)} />

      <TopBar />
      
      {/* Canvas / Mobile Layout */}
      <main ref={constraintsRef} className="absolute inset-0 z-10 pt-24 pb-32 overflow-y-auto overflow-x-hidden md:overflow-hidden flex flex-row flex-wrap justify-center content-start md:block gap-6 px-4">
        <StickyNote zIndex={topZ} onBringToFront={bringToFront} constraintsRef={constraintsRef} />
        <PostCard zIndex={topZ} onBringToFront={bringToFront} constraintsRef={constraintsRef} />
        <ClockWidget zIndex={topZ} onBringToFront={bringToFront} constraintsRef={constraintsRef} />
        
        {siteData.folders.map((folder, index) => {
          const folderPosKey = (`folder${index + 1}` as keyof typeof siteData.positions);
          const pos = siteData.positions[folderPosKey] || { x: `${30 + index * 18}%`, y: '50%' };
          return (
            <Folder
              key={folder.id}
              folder={folder}
              initialX={pos.x}
              initialY={pos.y}
              zIndex={topZ}
              onBringToFront={bringToFront}
              constraintsRef={constraintsRef}
              onClick={() => handleOpenFolder(folder.id)}
            />
          );
        })}

        <PdfFile zIndex={topZ} onBringToFront={bringToFront} constraintsRef={constraintsRef} url={pdfUrl} />
      </main>

      {/* Animated Folder Overlay with Close button & Esc key support */}
      <FolderOverlay
        isOpen={Boolean(openFolderId)}
        folderId={openFolderId}
        onClose={handleCloseFolder}
      />

      <ChatBar onOpenFolder={handleOpenFolder} />
    </div>
  );
}

export default App;
