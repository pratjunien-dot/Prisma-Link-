'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Dock } from '@/components/Dock';
import { MatrixCard } from '@/components/MatrixCard';
import { PersonaCard } from '@/components/PersonaCard';
import { generateTopicsAction, generateMatricesAction, generatePersonasAction } from '@/app/actions';
import { Matrix, Persona, Message } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles, RefreshCw } from 'lucide-react';

type Phase = 'idle' | 'generating_matrices' | 'selecting_matrix' | 'generating_personas' | 'selecting_persona' | 'chat';

export default function Home() {
  const { theme } = useAppStore();
  const [currentTab, setCurrentTab] = useState('home');
  const [phase, setPhase] = useState<Phase>('idle');
  
  const [input, setInput] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [matrices, setMatrices] = useState<Matrix[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<Matrix | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentTab === 'home' && topics.length === 0) {
      loadTopics();
    }
  }, [currentTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadTopics = async () => {
    const t = await generateTopicsAction();
    setTopics(t);
  };

  const handleStart = async (text: string) => {
    if (!text.trim()) return;
    setInput(text);
    setPhase('generating_matrices');
    try {
      const m = await generateMatricesAction(text);
      setMatrices(m.map((mat: any, i: number) => ({ ...mat, id: `mat-${i}` })));
      setPhase('selecting_matrix');
    } catch (e) {
      console.error(e);
      setPhase('idle');
    }
  };

  const handleSelectMatrix = async (matrix: Matrix) => {
    setSelectedMatrix(matrix);
    setPhase('generating_personas');
    try {
      const p = await generatePersonasAction(input, matrix.theme, matrix.dimensions);
      setPersonas(p.map((per: any, i: number) => ({ ...per, id: `per-${i}`, matrix })));
      setPhase('selecting_persona');
    } catch (e) {
      console.error(e);
      setPhase('selecting_matrix');
    }
  };

  const handleSelectPersona = async (persona: Persona) => {
    setSelectedPersona(persona);
    setPhase('chat');
    
    // Add user message
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input };
    setMessages([userMsg]);
    
    // Start streaming response
    await streamResponse(input, persona, selectedMatrix!, [userMsg]);
  };

  const streamResponse = async (text: string, persona: Persona, matrix: Matrix, history: Message[]) => {
    setIsStreaming(true);
    const assistantMsgId = crypto.randomUUID();
    setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '', persona }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: text,
          persona,
          matrix,
          previousMessages: history.slice(0, -1) // Exclude the current user message being sent
        })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId ? { ...msg, content: msg.content + chunk } : msg
        ));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || !selectedPersona || !selectedMatrix) return;
    
    const text = input;
    setInput('');
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    
    await streamResponse(text, selectedPersona, selectedMatrix, newHistory);
  };

  const resetFlow = () => {
    setPhase('idle');
    setInput('');
    setMessages([]);
    setSelectedMatrix(null);
    setSelectedPersona(null);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col theme-${theme} transition-colors duration-500`}>
      <Header />
      
      <main className="flex-1 overflow-y-auto p-4 pb-32 no-scrollbar relative">
        <AnimatePresence mode="wait">
          
          {/* IDLE PHASE */}
          {phase === 'idle' && currentTab === 'home' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto w-full gap-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">Prisma Link</h2>
                <p className="opacity-70 text-lg">Choisissez votre interlocuteur. Façonnez la pensée.</p>
              </div>

              <div className="w-full relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStart(input)}
                  placeholder="De quoi voulez-vous parler ?"
                  className="w-full glass rounded-full py-4 pl-6 pr-14 outline-none focus:ring-2 focus:ring-[var(--color-dark-accent)] transition-all text-lg"
                />
                <button 
                  onClick={() => handleStart(input)}
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 bottom-2 aspect-square rounded-full accent-bg flex items-center justify-center text-white disabled:opacity-50 transition-opacity"
                >
                  <Send size={20} />
                </button>
              </div>

              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium opacity-70 flex items-center gap-2"><Sparkles size={16}/> Suggestions</h3>
                  <button onClick={loadTopics} className="p-2 opacity-50 hover:opacity-100 transition-opacity"><RefreshCw size={16}/></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {topics.length > 0 ? topics.map((topic, i) => (
                    <button 
                      key={i}
                      onClick={() => handleStart(topic)}
                      className="glass p-4 rounded-2xl text-left text-sm hover:bg-white/10 transition-colors"
                    >
                      {topic}
                    </button>
                  )) : (
                    Array(6).fill(0).map((_, i) => <div key={i} className="glass p-4 rounded-2xl h-16 animate-pulse" />)
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* LOADING MATRICES */}
          {phase === 'generating_matrices' && (
            <motion.div key="gen-mat" className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
              <Loader2 size={48} className="animate-spin accent-text" />
              <p className="text-lg font-medium animate-pulse">Génération des matrices stylistiques...</p>
            </motion.div>
          )}

          {/* SELECTING MATRIX */}
          {phase === 'selecting_matrix' && (
            <motion.div 
              key="sel-mat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto w-full space-y-6 pt-4"
            >
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold">Profils Épistémiques</h2>
                <p className="opacity-70">Sélectionnez l&apos;orientation cognitive de la réponse.</p>
              </div>
              <div className="grid gap-4">
                {matrices.map(matrix => (
                  <MatrixCard 
                    key={matrix.id} 
                    matrix={matrix} 
                    isSelected={selectedMatrix?.id === matrix.id}
                    onClick={() => handleSelectMatrix(matrix)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* LOADING PERSONAS */}
          {phase === 'generating_personas' && (
            <motion.div key="gen-per" className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
              <Loader2 size={48} className="animate-spin accent-text" />
              <p className="text-lg font-medium animate-pulse">Instanciation des personas...</p>
            </motion.div>
          )}

          {/* SELECTING PERSONA */}
          {phase === 'selecting_persona' && (
            <motion.div 
              key="sel-per"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto w-full space-y-6 pt-4"
            >
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold">Incarnations</h2>
                <p className="opacity-70">Choisissez la voix qui portera cette pensée.</p>
              </div>
              <div className="grid gap-4">
                {personas.map(persona => (
                  <PersonaCard 
                    key={persona.id} 
                    persona={persona} 
                    isSelected={selectedPersona?.id === persona.id}
                    onClick={() => handleSelectPersona(persona)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* CHAT PHASE */}
          {phase === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto w-full flex flex-col h-full"
            >
              {selectedPersona && (
                <div className="mb-6 flex justify-center">
                  <div className="glass px-4 py-2 rounded-full text-xs font-medium opacity-80 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full accent-bg animate-pulse" />
                    En conversation avec {selectedPersona.name}
                  </div>
                </div>
              )}
              
              <div className="flex-1 space-y-6">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.role === 'assistant' && msg.persona && (
                      <span className="text-xs opacity-50 mb-1 ml-2">{msg.persona.name}</span>
                    )}
                    <div className={`max-w-[85%] p-4 rounded-3xl ${msg.role === 'user' ? 'accent-bg text-white rounded-br-sm' : 'glass rounded-bl-sm'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="fixed bottom-24 left-4 right-4 max-w-3xl mx-auto z-40">
                <form onSubmit={handleChatSubmit} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Répondre..."
                    disabled={isStreaming}
                    className="w-full glass rounded-full py-4 pl-6 pr-14 outline-none focus:ring-2 focus:ring-[var(--color-dark-accent)] transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                    className="absolute right-2 top-2 bottom-2 aspect-square rounded-full accent-bg flex items-center justify-center text-white disabled:opacity-50 transition-opacity"
                  >
                    {isStreaming ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* FAVORITES TAB */}
          {currentTab === 'favorites' && (
            <motion.div 
              key="favs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto w-full space-y-6 pt-4"
            >
              <h2 className="text-2xl font-bold text-center mb-8">Personas Favoris</h2>
              <FavoritesList onSelect={(p) => {
                setSelectedPersona(p);
                setSelectedMatrix(p.matrix || null);
                setPhase('chat');
                setMessages([]);
                setCurrentTab('home');
              }} />
            </motion.div>
          )}

          {/* DEBATE TAB */}
          {currentTab === 'debate' && (
            <motion.div 
              key="debate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto w-full space-y-6 pt-4"
            >
              <h2 className="text-2xl font-bold text-center mb-8">Mode Débat</h2>
              <DebateSetup />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Dock currentTab={currentTab} setTab={(t) => {
        if (t === 'home' && phase === 'chat') {
          // Keep chat if active
        } else if (t === 'home') {
          resetFlow();
        }
        setCurrentTab(t);
      }} />
    </div>
  );
}

function FavoritesList({ onSelect }: { onSelect: (p: Persona) => void }) {
  const { favoritePersonas } = useAppStore();
  
  if (favoritePersonas.length === 0) {
    return <div className="text-center opacity-50 py-12">Aucun persona favori pour le moment.</div>;
  }

  return (
    <div className="grid gap-4">
      {favoritePersonas.map(p => (
        <PersonaCard key={p.id} persona={p} onClick={() => onSelect(p)} />
      ))}
    </div>
  );
}

function DebateSetup() {
  const { favoritePersonas } = useAppStore();
  const [selected, setSelected] = useState<Persona[]>([]);
  const [topic, setTopic] = useState('');
  const [isDebating, setIsDebating] = useState(false);
  const [debateMessages, setDebateMessages] = useState<Message[]>([]);

  const toggleSelect = (p: Persona) => {
    if (selected.find(s => s.id === p.id)) {
      setSelected(selected.filter(s => s.id !== p.id));
    } else if (selected.length < 2) {
      setSelected([...selected, p]);
    }
  };

  const startDebate = async () => {
    if (selected.length !== 2 || !topic.trim()) return;
    setIsDebating(true);
    
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: topic };
    setDebateMessages([userMsg]);

    await streamDebateTurn(topic, selected[0], selected[1], [userMsg]);
  };

  const streamDebateTurn = async (input: string, activePersona: Persona, otherPersona: Persona, history: Message[]) => {
    const assistantMsgId = crypto.randomUUID();
    setDebateMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '', persona: activePersona }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          persona: activePersona,
          matrix: activePersona.matrix,
          isDebate: true,
          previousMessages: history
        })
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setDebateMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId ? { ...msg, content: msg.content + chunk } : msg
        ));
      }

      if (history.length < 4) {
        const newHistory = [...history, { id: assistantMsgId, role: 'assistant', content: fullResponse, persona: activePersona } as Message];
        await streamDebateTurn(fullResponse, otherPersona, activePersona, newHistory);
      } else {
         setIsDebating(false);
      }

    } catch (e) {
      console.error(e);
      setIsDebating(false);
    }
  };

  if (isDebating || debateMessages.length > 0) {
    return (
      <div className="space-y-6 pb-24">
        {debateMessages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-center' : (msg.persona?.id === selected[0].id ? 'items-start' : 'items-end')}`}
          >
            {msg.role === 'assistant' && msg.persona && (
              <span className={`text-xs opacity-50 mb-1 ${msg.persona.id === selected[0].id ? 'ml-2' : 'mr-2'}`}>{msg.persona.name}</span>
            )}
            <div className={`max-w-[85%] p-4 rounded-3xl ${msg.role === 'user' ? 'glass text-center font-medium' : (msg.persona?.id === selected[0].id ? 'glass rounded-bl-sm border-l-4 border-l-[var(--color-dark-accent)]' : 'glass rounded-br-sm border-r-4 border-r-pink-500')}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {isDebating && (
          <div className="flex justify-center">
            <Loader2 size={24} className="animate-spin opacity-50" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-center opacity-70">Sélectionnez 2 personas pour débattre d&apos;un sujet.</p>
      
      <div className="grid gap-4">
        {favoritePersonas.map(p => (
          <div key={p.id} className="relative">
            <PersonaCard 
              persona={p} 
              isSelected={selected.some(s => s.id === p.id)}
              onClick={() => toggleSelect(p)}
              showFavoriteBtn={false}
            />
            {selected.findIndex(s => s.id === p.id) !== -1 && (
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full accent-bg flex items-center justify-center text-white font-bold z-10">
                {selected.findIndex(s => s.id === p.id) + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      {selected.length === 2 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-4 right-4 max-w-2xl mx-auto z-40 glass p-4 rounded-3xl flex gap-2"
        >
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Sujet du débat..."
            className="flex-1 bg-transparent outline-none px-4"
          />
          <button 
            onClick={startDebate}
            disabled={!topic.trim()}
            className="px-6 py-2 rounded-full accent-bg text-white font-medium disabled:opacity-50"
          >
            Lancer
          </button>
        </motion.div>
      )}
    </div>
  );
}
