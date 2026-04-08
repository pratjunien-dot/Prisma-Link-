'use server';

import { GoogleGenAI, Type } from '@google/genai';

function getAI() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey });
}

export async function generateTopicsAction() {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Génère 6 sujets de conversation ou questions philosophiques, créatifs ou analytiques très courts (max 6 mots).',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Liste de 6 sujets courts"
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error generating topics:", error);
    return ["Nature de la conscience", "Illusion du libre arbitre", "Esthétique du chaos", "Limites du langage", "Futur de l'évolution", "Temps et entropie"];
  }
}

export async function generateMatricesAction(input: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Pour le message suivant : "${input}", génère 3 matrices stylistiques distinctes. Chaque matrice possède un thème directeur et 6 dimensions spécifiques avec des labels uniques (ex: Rigueur analytique, Profondeur interprétative), reflétant une orientation stylistique et cognitive cohérente. Les intensités vont de 1 à 5. Les trois matrices doivent former des profils épistémiques radicalement contrastés.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            theme: { type: Type.STRING },
            dimensions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  intensity: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
}

export async function generatePersonasAction(input: string, matrixTheme: string, dimensions: any[]) {
  const ai = getAI();
  const dimsStr = dimensions.map(d => `${d.label}: ${d.intensity}/5`).join(', ');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Pour le message "${input}" et la matrice stylistique "${matrixTheme}" (${dimsStr}), génère 3 personas IA distincts qui incarnent parfaitement cette matrice. Chacun doit avoir un nom, une courte description de son approche, et une phrase d'amorce (catchphrase).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            catchphrase: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
}
