import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { StickyNote } from './components/desktop/StickyNote';
import { PostCard } from './components/desktop/PostCard';
import { ClockWidget } from './components/desktop/ClockWidget';
import { Folder } from './components/desktop/Folder';
import { PdfFile } from './components/desktop/PdfFile';
import { ChatBar } from './components/desktop/ChatBar';
import { siteData } from './data/site';

function App() {
  const [topZ, setTopZ] = useState(10);

  const bringToFront = () => setTopZ(z => z + 1);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--color-brand-bg)]">
      {/* Background Silhouette */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none opacity-50">
        <svg viewBox="0 0 1440 320" className="w-full h-auto text-[var(--color-brand-bg-light)]" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <TopBar />
      
      {/* Desktop Canvas */}
      <main className="absolute inset-0 z-10 pt-20 overflow-hidden">
        <StickyNote zIndex={topZ} onBringToFront={bringToFront} />
        <PostCard zIndex={topZ} onBringToFront={bringToFront} />
        <ClockWidget zIndex={topZ} onBringToFront={bringToFront} />
        
        {siteData.folders.map((folder, index) => (
          <Folder
            key={folder.id}
            folder={folder}
            initialX={Object.values(siteData.positions)[3 + index].x}
            initialY={Object.values(siteData.positions)[3 + index].y}
            zIndex={topZ}
            onBringToFront={bringToFront}
            onClick={() => console.log('Open folder', folder.id)}
          />
        ))}

        <PdfFile zIndex={topZ} onBringToFront={bringToFront} onClick={() => console.log('Open PDF')} />
      </main>

      <ChatBar />
    </div>
  );
}

export default App;
