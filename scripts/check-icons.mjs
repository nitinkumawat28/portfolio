import * as simpleIcons from "simple-icons";

// List of simple-icons export names configured in src/data/skillIcons.ts
const configuredIcons = [
  "siCplusplus",
  "siPython",
  "siC",
  "siHtml5",
  "siJavascript",
  "siCss",
  "siTailwindcss",
  "siReact",
  "siNodedotjs",
  "siThreedotjs",
  "siAstro",
  "siDocker",
  "siKubernetes",
  "siGithubactions",
  "siCloudflare",
  "siGooglecloud",
  "siMysql",
  "siMongodb",
  "siNeon",
  "siSupabase",
  "siGooglegemini",
  "siHuggingface",
  "siSemrush",
  "siGoogleads",
  "siGoogleanalytics",
  "siGoogletagmanager",
  "siFigma",
  "siGithub",
  "siPostman"
];

console.log(`Checking ${configuredIcons.length} brand icons against simple-icons...`);
const missing = [];

for (const name of configuredIcons) {
  if (!(name in simpleIcons)) {
    missing.push(name);
  }
}

if (missing.length === 0) {
  console.log("Success: All configured simple-icons exports exist! (0 missing)");
} else {
  console.error("Warning: The following exports are missing in this version of simple-icons:", missing);
  process.exit(1);
}
