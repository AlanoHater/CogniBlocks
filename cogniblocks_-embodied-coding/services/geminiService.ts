import { GoogleGenAI } from "@google/genai";
import { DraggableItem } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeCode = async (blocks: DraggableItem[]) => {
  const client = getClient();
  if (!client) {
    return "API Key is missing. Please configure your environment.";
  }

  const codeDescription = blocks.map(b => b.command).join(" -> ");

  const prompt = `
    You are a friendly, encouraging coding tutor for children (ages 8-12). 
    The student is building a program using visual blocks to move a robot through a maze.
    
    Here is the sequence of blocks they have assembled:
    ${codeDescription || "[Empty Workspace]"}
    
    Task:
    1. Briefly explain what this sequence will make the robot do in simple language.
    2. If the code is empty, encourage them to drag a block.
    3. If there are logical weirdnesses (like turning left 4 times in a row), gently hint at it.
    4. Keep it short (max 2-3 sentences).
    5. Use emojis to be engaging.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! I couldn't reach the thinking cloud right now. Try again later! ☁️";
  }
};
