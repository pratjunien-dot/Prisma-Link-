import { create } from "zustand";
import type { DebateMessage, FavoritePersona } from "@/types/prisma";

type DebatePhase = "IDLE" | "SETUP" | "DEBATING" | "DONE";

interface DebateState {
  phase: DebatePhase;
  topic: string;
  persona1: FavoritePersona | null;
  persona2: FavoritePersona | null;
  messages: DebateMessage[];
  isStreaming: boolean;
  
  setPhase: (phase: DebatePhase) => void;
  setTopic: (topic: string) => void;
  setPersonas: (p1: FavoritePersona, p2: FavoritePersona) => void;
  addMessage: (msg: DebateMessage) => void;
  appendChunk: (chunk: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  reset: () => void;
}

export const useDebateStore = create<DebateState>((set) => ({
  phase: "IDLE",
  topic: "",
  persona1: null,
  persona2: null,
  messages: [],
  isStreaming: false,

  setPhase: (phase) => set({ phase }),
  setTopic: (topic) => set({ topic }),
  setPersonas: (p1, p2) => set({ persona1: p1, persona2: p2 }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  appendChunk: (chunk) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      newMessages[newMessages.length - 1].content += chunk;
    }
    return { messages: newMessages };
  }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  reset: () => set({
    phase: "IDLE", topic: "", persona1: null, persona2: null, messages: [], isStreaming: false
  })
}));
