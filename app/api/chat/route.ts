import { GoogleGenAI } from '@google/genai';

function getAI() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey });
}

export async function POST(req: Request) {
  const ai = getAI();
  const { input, persona, matrix, isDebate, previousMessages } = await req.json();

  let systemInstruction = '';
  
  if (persona && matrix) {
    const dimsStr = matrix.dimensions.map((d: any) => `${d.label}: ${d.intensity}/5`).join(', ');
    systemInstruction = `Tu es ${persona.name}. Description: ${persona.description}. Ta phrase d'amorce est: "${persona.catchphrase}". 
Ton style de communication et ta cognition sont STRICTEMENT dictés par la matrice stylistique suivante : "${matrix.theme}".
Dimensions de ta matrice : ${dimsStr}.
Tu dois répondre au message de l'utilisateur en incarnant totalement ce persona et cette matrice. Ne sors jamais de ton personnage.`;

    if (isDebate) {
      systemInstruction += `\nCeci est un débat. Tu dois défendre ton point de vue avec ferveur, en opposition avec l'autre persona, tout en respectant ta matrice stylistique.`;
    }
  } else {
    systemInstruction = "Tu es un assistant IA.";
  }

  let contents = input;
  if (previousMessages && previousMessages.length > 0) {
     contents = previousMessages.map((m: any) => `${m.role === 'user' ? 'User' : m.personaName}: ${m.content}`).join('\n\n') + `\n\nUser: ${input}`;
  }

  try {
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          if (chunk.text) {
            controller.enqueue(new TextEncoder().encode(chunk.text));
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    console.error("Streaming error:", error);
    return new Response("Une erreur s'est produite lors de la génération de la réponse.", { status: 500 });
  }
}
