import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from "../types";

// Vite exposes env vars prefixed with VITE_ via import.meta.env
const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';

class GeminiService {
  private ai: GoogleGenAI | null;
  private chatSession: Chat | null = null;

  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    } else {
      // Don't initialize the AI client if no key is provided (avoids runtime errors in the browser)
      console.warn('VITE_GEMINI_API_KEY not set - Gemini service disabled');
      this.ai = null;
    }
  }

  // Initialize a chat session with system instructions
  public initChat(systemInstruction?: string) {
    if (!this.ai) {
      console.warn('Gemini not configured - initChat skipped');
      this.chatSession = null;
      return;
    }

    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction || "You are FlowForge AI, a helpful and intelligent business operations assistant. You help manage tasks, inventory queries, and general business advice. Keep answers concise and professional.",
      },
    });
  }

  // Send a message to the chat
  public async sendMessage(message: string): Promise<string> {
    if (!this.ai) {
      return "AI service not configured. Please set VITE_GEMINI_API_KEY.";
    }

    if (!this.chatSession) {
      this.initChat();
    }

    if (!this.chatSession) {
      return "AI chat session could not be initialized.";
    }

    try {
      const response = await this.chatSession.sendMessage({ message });
      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error connecting to AI service. Please check your API key.";
    }
  }

  // One-off generation for things like summarizing a report
  public async generateSummary(text: string): Promise<string> {
    if (!this.ai) {
      return "AI service not configured. Please set VITE_GEMINI_API_KEY.";
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Summarize the following business data or text into 3 key bullet points:\n\n${text}`,
      });
      return response.text || "No summary available.";
    } catch (error) {
      console.error("Gemini Summary Error:", error);
      return "Could not generate summary.";
    }
  }
}

export const geminiService = new GeminiService();