export interface Condition {
  name: string;
  confidence: number;
  overview: string;
  action: 'rest' | 'otc' | 'doctor' | 'emergency';
  urgency: 1 | 2 | 3 | 4 | 5;
}

export interface AnalysisResult {
  possible_conditions: Condition[];
  recommended_action: string;
  disclaimer: string;
  urgency_level: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language: Language;
}

export type Language = 'english' | 'hindi' | 'telugu';

export interface Translation {
  [key: string]: {
    english: string;
    hindi: string;
    telugu: string;
  };
}