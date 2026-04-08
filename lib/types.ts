export type Dimension = { label: string; intensity: number };
export type Matrix = { id: string; theme: string; dimensions: Dimension[] };
export type Persona = { id: string; name: string; description: string; catchphrase: string; matrix?: Matrix };
export type Message = { id: string; role: 'user' | 'assistant'; content: string; persona?: Persona };
export type Theme = 'dark' | 'light' | 'cyberpunk';
