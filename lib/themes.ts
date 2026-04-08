export const THEMES = {
  obsidian: {
    name:"Obsidian", icon:"◈",
    bg:"#04070F", accent:"#38BDF8", accentAlt:"#818CF8",
    glow1:"rgba(56,189,248,0.055)", glow2:"rgba(139,92,246,0.04)",
  },
  aurora: {
    name:"Aurora", icon:"◉",
    bg:"#030D0A", accent:"#4ADE80", accentAlt:"#34D399",
    glow1:"rgba(74,222,128,0.06)", glow2:"rgba(56,189,248,0.04)",
  },
  prism: {
    name:"Prism", icon:"△",
    bg:"#080512", accent:"#C084FC", accentAlt:"#FB7185",
    glow1:"rgba(192,132,252,0.065)", glow2:"rgba(251,113,133,0.04)",
  },
  dusk: {
    name:"Dusk", icon:"◆",
    bg:"#0A0608", accent:"#FB7185", accentAlt:"#FBBF24",
    glow1:"rgba(251,113,133,0.06)", glow2:"rgba(251,191,36,0.04)",
  },
} as const;

export type ThemeKey = keyof typeof THEMES;
export const MATRIX_COLORS = ["#38BDF8", "#C084FC", "#FB7185"] as const;
