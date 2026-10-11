export type DeckStat = {
  value: number | string;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export type DeckAction = {
  label: string;
  variant?: "primary" | "ghost";
  href?: string;
  onClick?: () => void;
};

export type DeckItem = {
  id: string;
  title: string;
  meta: string;
  description: string;
  stats: DeckStat[];
  accent: string;
  image?: string;
  imageAlt?: string;
  actions: DeckAction[];
};
