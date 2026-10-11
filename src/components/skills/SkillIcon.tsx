import { skillIcons, defaultSkillIcon } from "../../data/skillIcons";

interface Props {
  name: string;
  size?: number;
  className?: string;
}

export function SkillIcon({ name, size = 18, className = "" }: Props) {
  const entry = skillIcons[name] || defaultSkillIcon;
  const scale = entry.scale ?? 1;

  if (entry.kind === "brand") {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={`shrink-0 transition-colors duration-150 ${className}`}
        style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
      >
        <path d={entry.icon.path} />
      </svg>
    );
  }

  const Generic = entry.Icon;
  return (
    <Generic
      size={size}
      strokeWidth={1.8}
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 transition-colors duration-150 ${className}`}
      style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
    />
  );
}
