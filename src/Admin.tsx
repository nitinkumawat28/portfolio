import { useState, useRef } from 'react';
import { siteData } from './data/site';

export function Admin() {
  const [formData, setFormData] = useState({
    name: siteData.name,
    role: siteData.role,
    niche: siteData.niche,
    telegram: siteData.socialLinks.telegram,
    linkedin: siteData.socialLinks.linkedin,
    email: siteData.socialLinks.email,
    github: siteData.socialLinks.github,
    pdfBase64: siteData.customPdfBase64 || ''
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({ ...formData, pdfBase64: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);
    try {
      const customData = {
        name: formData.name,
        role: formData.role,
        niche: formData.niche,
        socialLinks: {
          telegram: formData.telegram,
          linkedin: formData.linkedin,
          email: formData.email,
          github: formData.github
        },
        customPdfBase64: formData.pdfBase64 || null
      };

      // Ensure we don't accidentally overwrite positions/folders
      const mergedData = { ...siteData, ...customData };
      localStorage.setItem('customSiteData', JSON.stringify(mergedData));
      
      alert('Saved successfully!');
      window.location.href = '/'; // redirect to home
    } catch (e) {
      console.error(e);
      alert('Failed to save data. The PDF might be too large for local storage.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data to default?')) {
      localStorage.removeItem('customSiteData');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-8 md:p-20 font-sans overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-[#1a1a1a] rounded-2xl p-8 border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white/80 border-b border-white/10 pb-2">Profile Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/60">Name</span>
                <input name="name" value={formData.name} onChange={handleChange} className="bg-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/60">Role</span>
                <input name="role" value={formData.role} onChange={handleChange} className="bg-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/60">Niche</span>
                <input name="niche" value={formData.niche} onChange={handleChange} className="bg-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-white/80 border-b border-white/10 pb-2">Social Links (URLs)</h2>
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/60">LinkedIn URL</span>
                <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="bg-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/60">GitHub URL</span>
                <input name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." className="bg-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/60">Telegram URL</span>
                <input name="telegram" value={formData.telegram} onChange={handleChange} placeholder="https://t.me/..." className="bg-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/60">Email (mailto:)</span>
                <input name="email" value={formData.email} onChange={handleChange} placeholder="mailto:you@example.com" className="bg-[#2a2a2a] rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-white/80 border-b border-white/10 pb-2">Resume / CV (PDF)</h2>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-white/60">Upload your PDF resume. It will be saved locally and updated on the home page.</span>
              <input 
                type="file" 
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex gap-4 items-center">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Choose PDF
                </button>
                {formData.pdfBase64 ? (
                  <span className="text-green-400 text-sm">PDF loaded ({Math.round(formData.pdfBase64.length / 1024)} KB)</span>
                ) : (
                  <span className="text-yellow-500 text-sm">Default resume.pdf used</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4 border-t border-white/10 pt-6">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex-1"
          >
            {loading ? 'Saving...' : 'Save & Publish to Home'}
          </button>
          
          <button 
            onClick={handleReset}
            className="px-6 py-3 bg-red-900/50 hover:bg-red-900/80 text-red-200 font-semibold rounded-lg transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}
