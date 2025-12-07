import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from "../types";

const API_KEY = process.env.API_KEY || '';

class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  // Initialize a chat session with system instructions
  public initChat(systemInstruction?: string) {
    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction || "You are FlowForge AI, a helpful and intelligent business operations assistant. You help manage tasks, inventory queries, and general business advice. Keep answers concise and professional.",
      },
    });
  }

  // Send a message to the chat
  public async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      this.initChat();
    }
    
    try {
      const response = await this.chatSession!.sendMessage({ message });
      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error connecting to AI service. Please check your API key.";
    }
  }

  // One-off generation for things like summarizing a report
  public async generateSummary(text: string): Promise<string> {
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