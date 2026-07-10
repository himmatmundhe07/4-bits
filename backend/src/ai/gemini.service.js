import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor({ model, temperature } = {}) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.temperature = temperature ?? 0.7;
  }

  async generateCompletion(prompt, overrides = {}) {
    let selectedModel = overrides.model || this.modelName;
    // Safety check: if the model is specified as an Ollama model like qwen, fallback to Gemini
    if (!selectedModel.startsWith('gemini-')) {
      selectedModel = this.modelName;
    }

    const model = this.genAI.getGenerativeModel({
      model: selectedModel,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: overrides.temperature ?? this.temperature,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (error) {
      // Strip markdown code fences if model returned them
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    }
  }
}

export default GeminiService;
