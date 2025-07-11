import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalysisResult } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const API_KEY = 'AIzaSyCK2l9Lz3mb7wauMeF5y03dm_NeVPIGrWU';
    this.genAI = new GoogleGenerativeAI(API_KEY);
    // Use the correct model name for the current API version
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeSymptoms(symptoms: string, language: string): Promise<AnalysisResult> {
    try {
      const prompt = this.createSymptomAnalysisPrompt(symptoms, language);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseAnalysisResponse(text, language);
    } catch (error) {
      console.error('Gemini API Error:', error);
      return this.getFallbackAnalysis(symptoms, language);
    }
  }

  async chatResponse(message: string, language: string, conversationHistory: string[] = []): Promise<string> {
    try {
      const prompt = this.createChatPrompt(message, language, conversationHistory);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Chat Error:', error);
      return this.getFallbackChatResponse(language);
    }
  }

  private createSymptomAnalysisPrompt(symptoms: string, language: string): string {
    const languageInstruction = this.getLanguageInstruction(language);
    
    return `You are a medical AI assistant. Analyze these symptoms: "${symptoms}".

${languageInstruction}

Provide a JSON response with this exact structure:
{
  "possible_conditions": [
    {
      "name": "Condition Name",
      "confidence": 75,
      "overview": "Brief 2-sentence medical explanation",
      "action": "rest|otc|doctor|emergency",
      "urgency": 3
    }
  ],
  "recommended_action": "Clear recommendation",
  "disclaimer": "AI suggestion disclaimer",
  "urgency_level": 3
}

Rules:
1. Provide 1-3 most likely conditions
2. Confidence: 0-100%
3. Urgency: 1-5 scale (5 = emergency)
4. For emergency symptoms (chest pain, severe bleeding, difficulty breathing), set urgency=5
5. Be accurate, not speculative
6. Include proper medical disclaimer`;
  }

  private createChatPrompt(message: string, language: string, history: string[]): string {
    const languageInstruction = this.getLanguageInstruction(language);
    const historyContext = history.length > 0 ? `\nConversation history: ${history.join(' | ')}` : '';
    
    return `You are a compassionate medical AI assistant. Respond to: "${message}"

${languageInstruction}${historyContext}

Guidelines:
1. Be empathetic and supportive
2. Ask relevant follow-up questions about symptoms
3. Provide helpful health information
4. Always recommend professional medical care for serious concerns
5. If emergency symptoms mentioned (chest pain, severe bleeding, difficulty breathing), immediately advise seeking emergency care
6. Keep responses conversational and under 100 words`;
  }

  private getLanguageInstruction(language: string): string {
    switch (language) {
      case 'hindi':
        return 'Respond in Hindi (हिंदी में उत्तर दें)';
      case 'telugu':
        return 'Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి)';
      default:
        return 'Respond in English';
    }
  }

  private parseAnalysisResponse(text: string, language: string): AnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateAndFormatAnalysis(parsed);
      }
    } catch (error) {
      console.error('JSON parsing error:', error);
    }
    
    return this.getFallbackAnalysis('', language);
  }

  private validateAndFormatAnalysis(parsed: any): AnalysisResult {
    return {
      possible_conditions: parsed.possible_conditions?.map((condition: any) => ({
        name: condition.name || 'Unknown Condition',
        confidence: Math.min(Math.max(condition.confidence || 50, 0), 100),
        overview: condition.overview || 'Medical evaluation needed',
        action: ['rest', 'otc', 'doctor', 'emergency'].includes(condition.action) 
          ? condition.action : 'doctor',
        urgency: Math.min(Math.max(condition.urgency || 2, 1), 5) as 1 | 2 | 3 | 4 | 5
      })) || [],
      recommended_action: parsed.recommended_action || 'Consult healthcare professional',
      disclaimer: parsed.disclaimer || 'AI suggestion, not medical diagnosis',
      urgency_level: Math.min(Math.max(parsed.urgency_level || 2, 1), 5)
    };
  }

  private getFallbackAnalysis(symptoms: string, language: string): AnalysisResult {
    const translations = {
      english: {
        condition: 'General Health Concern',
        overview: 'Based on your symptoms, monitoring and professional evaluation may be needed.',
        action: 'Monitor symptoms and consult healthcare professional if they persist',
        disclaimer: 'This is an AI suggestion, not a medical diagnosis. Always consult healthcare professionals.'
      },
      hindi: {
        condition: 'सामान्य स्वास्थ्य चिंता',
        overview: 'आपके लक्षणों के आधार पर, निगरानी और पेशेवर मूल्यांकन की आवश्यकता हो सकती है।',
        action: 'लक्षणों की निगरानी करें और यदि वे बने रहें तो स्वास्थ्य पेशेवर से सलाह लें',
        disclaimer: 'यह AI सुझाव है, चिकित्सा निदान नहीं। हमेशा स्वास्थ्य पेशेवरों से सलाह लें।'
      },
      telugu: {
        condition: 'సాధారణ ఆరోగ్య ఆందోళన',
        overview: 'మీ లక్షణాల ఆధారంగా, పర్యవేక్షణ మరియు వృత్తిపరమైన మూల్యాంకనం అవసరం కావచ్చు.',
        action: 'లక్షణాలను పర్యవేక్షించండి మరియు అవి కొనసాగితే ఆరోగ్య నిపుణుడిని సంప్రదించండి',
        disclaimer: 'ఇది AI సలహా, వైద్య నిర్ధారణ కాదు. ఎల్లప్పుడూ ఆరోగ్య నిపుణులను సంప్రదించండి.'
      }
    };

    const lang = translations[language as keyof typeof translations] || translations.english;

    return {
      possible_conditions: [{
        name: lang.condition,
        confidence: 60,
        overview: lang.overview,
        action: 'doctor',
        urgency: 2
      }],
      recommended_action: lang.action,
      disclaimer: lang.disclaimer,
      urgency_level: 2
    };
  }

  private getFallbackChatResponse(language: string): string {
    const responses = {
      english: "I'm here to help with your health concerns. Could you tell me more about what you're experiencing?",
      hindi: "मैं आपकी स्वास्थ्य संबंधी चिंताओं में मदद करने के लिए यहां हूं। क्या आप बता सकते हैं कि आप क्या अनुभव कर रहे हैं?",
      telugu: "మీ ఆరోగ్య సమస్యలతో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. మీరు ఏమి అనుభవిస్తున్నారో చెప్పగలరా?"
    };

    return responses[language as keyof typeof responses] || responses.english;
  }
}

export const geminiService = new GeminiService();