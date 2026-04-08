export type Phase    = "INPUT" | "MATRIX" | "PERSONA" | "STREAM";
export type ThemeKey = "obsidian" | "aurora" | "prism" | "dusk";

export interface Dimension {
  label: string;
  value: number;      // float 1.0 – 5.0
}

export interface Matrix {
  id:         "A" | "B" | "C";
  theme:      string;           // 2-3 mots
  dimensions: Dimension[];      // exactement 6, labels uniques par matrice
}

export interface MatrixWithColor extends Matrix {
  color: string;                // ex: "#38BDF8"
}

export interface Persona {
  id:    number;
  name:  string;    // 1 mot MAJUSCULES
  role:  string;    // ex: "Architecte Épistémique"
  quote: string;    // phrase signature
  glyph: string;    // ex: "◈"
}

export interface PersonaWithColor extends Persona {
  color: string;
}

export interface FavoritePersona extends Persona {
  matrixTheme: string;
  matrixColor: string;
  savedAt:     number;  // Date.now()
}

export interface DebateMessage {
  personaId:    number;
  personaName:  string;
  personaGlyph: string;
  color:        string;
  content:      string;
  turn:         number;  // 1–4
}

export interface Suggestion {
  text:  string;
  glyph: string;
}

export interface Theme {
  name:      string;
  icon:      string;
  bg:        string;
  accent:    string;
  accentAlt: string;
  glow1:     string;
  glow2:     string;
}
