const defaultSiteData = {
  name: "Nitin Kumawat",
  shortName: "Nitin",
  role: "AI & Full-Stack Developer",
  tagline: "Student at SVNIT. I analyze product data and market research for startups.",
  niche: "Product Data & AI SaaS",
  timezoneLabel: "IST",
  timezone: "Asia/Kolkata",
  email: "nitinkumawat2807@gmail.com",
  introParagraph: "Hi, I’m Nitin, Student at SVNIT. I analyze product data and market research for startups. I turn numbers and customer feedback into clear decisions. AI assisted Saas developer solving real world problem.",
  socialLinks: {
    email: "mailto:nitinkumawat2807@gmail.com",
    linkedin: "https://www.linkedin.com/in/nitin-kumawat-25367a311/",
    github: "https://github.com/nitinkumawat28",
    whatsapp: "[OPTIONAL: https://wa.me/91XXXXXXXXXX]",
    telegram: ""
  },
  postCard: {
    channelName: "https://healthsaral.in",
    avatar: "/healthsaral-logo.png",
    text: "AI-powered health report analyzer that turns complex medical reports into easy-to-understand language.",
    views: "20 daily active users",
    timeAgo: "2026",
    url: "https://healthsaral.in/"
  },
  folders: [
    { id: "projects", title: "Projects", isFeatured: false, color: "pink" },
    { id: "repositories", title: "Git Repositories", isFeatured: false, color: "emerald" },
    { id: "skills", title: "Skills", isFeatured: false, color: "cyan" },
    { id: "achievements", title: "Achievements & Certificates", isFeatured: false, color: "amber" }
  ],
  positions: {
    stickyNote: { x: "5%", y: "14%" },
    postCard: { x: "36%", y: "14%" },
    clock: { x: "84%", y: "14%" },
    folder1: { x: "22%", y: "48%" },
    folder2: { x: "40%", y: "50%" },
    folder3: { x: "58%", y: "48%" },
    folder4: { x: "76%", y: "50%" },
    pdf: { x: "8%", y: "58%" }
  },
  customPdfBase64: null as string | null
};

// Merge with localStorage
let mergedData = defaultSiteData;
try {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('customSiteData');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Only merge specific fields to avoid overwriting folders/positions if they update in code
      mergedData = { 
        ...defaultSiteData, 
        name: parsed.name ?? defaultSiteData.name,
        role: parsed.role ?? defaultSiteData.role,
        niche: parsed.niche ?? defaultSiteData.niche,
        socialLinks: parsed.socialLinks ?? defaultSiteData.socialLinks,
        customPdfBase64: parsed.customPdfBase64 ?? defaultSiteData.customPdfBase64,
        // specifically omit folders and positions so code changes apply
      };
    }
  }
} catch (e) {
  console.error("Failed to load site data", e);
}

export const siteData = mergedData;
