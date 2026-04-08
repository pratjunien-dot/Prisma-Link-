import { create } from "zustand";
import type { Phase, Matrix, MatrixWithColor, Persona, PersonaWithColor } from "@/types/prisma";
import { MATRIX_COLORS } from "@/lib/themes";

interface PipelineState {
  phase:           Phase;
  input:           string;
  matrices:        Matrix[];
  selectedMatrix:  MatrixWithColor | null;
  personas:        Persona[];
  selectedPersona: PersonaWithColor | null;
  response:        string;
  isLoading:       boolean;
  isStreaming:     boolean;
  error:           string | null;

  setInput:      (v: string) => void;
  setPhase:      (p: Phase) => void;
  setMatrices:   (m: Matrix[]) => void;
  selectMatrix:  (m: Matrix, idx: number) => void;
  setPersonas:   (p: Persona[]) => void;
  selectPersona: (p: Persona) => void;
  appendChunk:   (chunk: string) => void;
  setLoading:    (v: boolean) => void;
  setStreaming:   (v: boolean) => void;
  setError:      (e: string | null) => void;
  reset:         () => void;
}

export const usePipelineStore = create<PipelineState>((set) => ({
  phase: "INPUT", input: "", matrices: [], selectedMatrix: null,
  personas: [], selectedPersona: null, response: "",
  isLoading: false, isStreaming: false, error: null,

  setInput:      (input)   => set({ input }),
  setPhase:      (phase)   => set({ phase }),
  setMatrices:   (matrices)=> set({ matrices }),
  selectMatrix:  (m, idx)  => set({ selectedMatrix: { ...m, color: MATRIX_COLORS[idx] } }),
  setPersonas:   (personas)=> set({ personas }),
  selectPersona: (p)       => set((s) => ({ selectedPersona: { ...p, color: s.selectedMatrix?.color ?? "#38BDF8" } })),
  appendChunk:   (chunk)   => set((s) => ({ response: s.response + chunk })),
  setLoading:    (isLoading)  => set({ isLoading }),
  setStreaming:  (isStreaming) => set({ isStreaming }),
  setError:      (error)   => set({ error }),
  reset: () => set({
    phase: "INPUT", input: "", matrices: [], selectedMatrix: null,
    personas: [], selectedPersona: null, response: "",
    isLoading: false, isStreaming: false, error: null,
  }),
}));
