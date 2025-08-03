import { GoogleGenAI, Type } from "@google/genai";
import { Session, MemoryPair, Message, User, Role } from "../types";

const API_KEY = process.env.API_KEY;

// This check determines if the app should use the live API or mock data.
export const isApiConfigured = API_KEY && API_KEY !== 'YOUR_API_KEY';

if (!isApiConfigured) {
  console.warn("Gemini API key not found or is a placeholder. Running in Demo Mode with mock data.");
}

// Initialize the AI client only if the key is configured.
const ai = isApiConfigured ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const MemoryGameSchema = {
  type: Type.OBJECT,
  properties: {
    pairs: {
      type: Type.ARRAY,
      description: "An array of 8 pairs of related words or concepts for a children's memory game. Words should be simple, concrete, and easy to visualize.",
      items: {
        type: Type.OBJECT,
        properties: {
          item1: { type: Type.STRING, description: "The first item in the pair (e.g., 'Bee')." },
          item2: { type: Type.STRING, description: "The second item in the pair (e.g., 'Honey')." }
        },
        required: ["item1", "item2"]
      }
    }
  },
  required: ["pairs"]
};

const fallbackPairs: MemoryPair[] = [
    { item1: "Cat", item2: "Kitten" }, { item1: "Dog", item2: "Puppy" },
    { item1: "Sun", item2: "Moon" }, { item1: "Shoe", item2: "Sock" },
    { item1: "Milk", item2: "Cookie" }, { item1: "Key", item2: "Lock" },
    { item1: "Apple", item2: "Tree" }, { item1: "Car", item2: "Wheel" }
];

export const generateMemoryGamePairs = async (): Promise<MemoryPair[]> => {
  if (!ai) return Promise.resolve(fallbackPairs);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate 8 unique pairs of related, simple words for a children's memory game. Examples: 'Sun' & 'Moon', 'Cat' & 'Mouse'.",
      config: {
        responseMimeType: "application/json",
        responseSchema: MemoryGameSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result && result.pairs && Array.isArray(result.pairs) && result.pairs.length > 0) {
       return result.pairs;
    }
    throw new Error("Invalid data structure received from AI.");

  } catch (error) {
    console.error("Error generating memory game pairs, returning fallback data:", error);
    return fallbackPairs;
  }
};


export const getEncouragingMessage = async (score: number, total: number): Promise<string> => {
  if (!ai) return Promise.resolve("You did a fantastic job! Keep up the great work!");

  const prompt = `A child just played a cognitive game. Their final score was ${score}. Write a short, single-paragraph, encouraging, and positive message for the child. Keep it cheerful and simple. Don't mention the score directly.`;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating encouraging message:", error);
    return "You did a fantastic job! Keep up the great work!";
  }
};

export const summarizeProgress = async (sessions: Session[]): Promise<string> => {
   if (!ai) {
    return Promise.resolve(
        `* Overall performance is showing a positive trend.
* Memory game scores have increased steadily over the last few sessions.
* Accuracy remains high, which suggests strong focus and understanding.
* Continued practice will surely lead to even greater results!`
    );
  }
  
  if (sessions.length === 0) {
    return "No session data available to analyze.";
  }

  const simplifiedSessions = sessions.map(({ date, gameType, score, accuracy }) => ({
    date: new Date(date).toLocaleDateString(),
    gameType,
    score,
    accuracy
  }));

  const prompt = `Act as a helpful clinical assistant. Here is a child's cognitive game performance data:
${JSON.stringify(simplifiedSessions, null, 2)}

Please provide a concise, easy-to-understand summary of the child's progress. Highlight positive trends, identify strengths (e.g., consistently high accuracy in a game type), and gently point out areas that might need more practice. Use bullet points for clarity. Keep the tone professional, encouraging, and optimistic.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing progress:", error);
    throw new Error("Failed to get AI-powered summary.");
  }
};

export const getHealthSuggestion = async (sessions: Session[]): Promise<string> => {
  if (!ai) {
    return Promise.resolve(
        `Disclaimer: This is an AI-generated analysis and not a substitute for professional medical advice. Please consult with a qualified healthcare provider or your child's therapist for any health concerns.

* Observation: The user is consistently engaging with the available cognitive games.
* Trend: Scores in the Memory game show a positive upward trend, which is a great sign of learning.
* Suggestion: This consistent play is excellent for building cognitive habits. Continue to encourage regular, low-pressure sessions.`
    );
  }

  if (sessions.length < 3) {
    return "There isn't enough gameplay data to generate a suggestion. After a few more sessions, we can provide a more meaningful analysis.";
  }

  const simplifiedSessions = sessions.map(({ date, gameType, score, accuracy }) => ({
    date: new Date(date).toLocaleDateString(),
    gameType,
    score,
    accuracy
  }));

  const prompt = `You are a helpful assistant for parents using a cognitive training app for their child. Based on the following cognitive game performance data, provide some general observations and suggestions.
  
  IMPORTANT:
  - DO NOT PROVIDE MEDICAL ADVICE or a diagnosis. Your response is for informational purposes only.
  - ALWAYS begin your response with this exact disclaimer: "Disclaimer: This is an AI-generated analysis and not a substitute for professional medical advice. Please consult with a qualified healthcare provider or your child's therapist for any health concerns."
  - Frame your response as observations of the data, not a judgment of the child.
  - Use a positive and supportive tone.
  
  Analyze the data for trends, strengths, and areas that might need more attention. Suggest if the patterns seem to indicate healthy engagement or if a consultation with a specialist might be beneficial to discuss the observations. Use bullet points.

  Data:
  ${JSON.stringify(simplifiedSessions, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating health suggestion:", error);
    throw new Error("Failed to get AI-powered health suggestion.");
  }
};


export const generateChatResponse = async (
  history: Message[],
  currentUser: User,
  contactUser: User,
  childContext?: User | null
): Promise<string> => {
   if (!ai) {
    return Promise.resolve(
      "Thank you for your message. This live chat is currently in demo mode. In a real environment, I would provide a detailed, context-aware response."
    );
  }

  const persona = contactUser.role === Role.Therapist 
    ? `You are ${contactUser.name}, a compassionate and professional child therapist.`
    : `You are ${contactUser.name}, a concerned and engaged parent.`;

  const context = childContext 
    ? `The conversation is about the child, ${childContext.name}.`
    : `The conversation is between a parent and a therapist.`;

  const formattedHistory = history.map(msg => 
    `${msg.senderId === currentUser.id ? 'Me' : contactUser.name}: ${msg.text}`
  ).join('\n');

  const prompt = `${persona} ${context} You are having a conversation with ${currentUser.name}.
Continue the conversation naturally based on the history below. Keep your response to 1-2 sentences.

Conversation History:
${formattedHistory}
${contactUser.name}:`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.8,
          topP: 0.9,
          maxOutputTokens: 100,
          thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to get AI chat response.");
  }
};