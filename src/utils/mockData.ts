import { AnalysisResult, ChatMessage } from '../types';

export const mockAnalyzeSymptoms = async (symptoms: string, language: string): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const lowerSymptoms = symptoms.toLowerCase();
  
  // Emergency keywords
  const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious', 'stroke'];
  const isEmergency = emergencyKeywords.some(keyword => lowerSymptoms.includes(keyword));
  
  if (isEmergency) {
    return {
      possible_conditions: [
        {
          name: language === 'hindi' ? 'तत्काल चिकित्सा आपातकाल' : language === 'telugu' ? 'తక్షణ వైద్య అత్యవసరం' : 'Medical Emergency',
          confidence: 95,
          overview: language === 'hindi' ? 'गंभीर लक्षण जिसमें तत्काल चिकित्सा हस्तक्षेप की आवश्यकता है।' : language === 'telugu' ? 'తక్షణ వైద్య జోక్యం అవసరమైన తీవ్రమైన లక్షణాలు.' : 'Critical symptoms requiring immediate medical intervention.',
          action: 'emergency',
          urgency: 5
        }
      ],
      recommended_action: language === 'hindi' ? 'तुरंत आपातकालीन कक्ष में जाएं' : language === 'telugu' ? 'వెంటనే అత్యవసర గదికి వెళ్లండి' : 'Go to emergency room immediately',
      disclaimer: language === 'hindi' ? 'यह AI सुझाव है, चिकित्सा निदान नहीं' : language === 'telugu' ? 'ఇది AI సలహా, వైద్య నిర్ధారణ కాదు' : 'AI suggestion, not medical diagnosis',
      urgency_level: 5
    };
  }
  
  // Common symptom patterns
  if (lowerSymptoms.includes('fever') && lowerSymptoms.includes('headache')) {
    return {
      possible_conditions: [
        {
          name: language === 'hindi' ? 'वायरल संक्रमण' : language === 'telugu' ? 'వైరల్ ఇన్ఫెక్షన్' : 'Viral Infection',
          confidence: 78,
          overview: language === 'hindi' ? 'सामान्य वायरल संक्रमण के लक्षण जो आम तौर पर स्व-सीमित होते हैं।' : language === 'telugu' ? 'సాధారణ వైరల్ ఇన్ఫెక్షన్ లక్షణాలు సాధారణంగా స్వయం పరిమితమవుతాయి.' : 'Common viral infection symptoms that are typically self-limiting.',
          action: 'rest',
          urgency: 2
        },
        {
          name: language === 'hindi' ? 'फ्लू' : language === 'telugu' ? 'ఫ్లూ' : 'Influenza',
          confidence: 65,
          overview: language === 'hindi' ? 'मौसमी फ्लू संक्रमण के संकेत।' : language === 'telugu' ? 'కాలానుగుణ ఫ్లూ ఇన్ఫెక్షన్ సంకేతాలు.' : 'Seasonal flu infection indicators.',
          action: 'otc',
          urgency: 3
        }
      ],
      recommended_action: language === 'hindi' ? 'आराम करें और तरल पदार्थों का सेवन बढ़ाएं' : language === 'telugu' ? 'విశ్రాంతి తీసుకోండి మరియు ద్రవ పదార్థాలు పెంచండి' : 'Rest and increase fluid intake',
      disclaimer: language === 'hindi' ? 'यह AI सुझाव है, चिकित्सा निदान नहीं' : language === 'telugu' ? 'ఇది AI సలహా, వైద్య నిర్ధారణ కాదు' : 'AI suggestion, not medical diagnosis',
      urgency_level: 2
    };
  }
  
  // Default response
  return {
    possible_conditions: [
      {
        name: language === 'hindi' ? 'सामान्य अस्वस्थता' : language === 'telugu' ? 'సాధారణ అనారోగ్యం' : 'General Malaise',
        confidence: 60,
        overview: language === 'hindi' ? 'सामान्य असहजता की भावना जिसके लिए निगरानी की आवश्यकता हो सकती है।' : language === 'telugu' ? 'పర్యవేక్షణ అవసరమైన సాధారణ అసౌకర్య భావన.' : 'General feeling of discomfort that may require monitoring.',
        action: 'rest',
        urgency: 2
      }
    ],
    recommended_action: language === 'hindi' ? 'लक्षणों की निगरानी करें' : language === 'telugu' ? 'లక్షణాలను పర్యవేక్షించండి' : 'Monitor symptoms',
    disclaimer: language === 'hindi' ? 'यह AI सुझाव है, चिकित्सा निदान नहीं' : language === 'telugu' ? 'ఇది AI సలహా, వైద్య నిర్ధారణ కాదు' : 'AI suggestion, not medical diagnosis',
    urgency_level: 2
  };
};

export const mockChatResponse = async (message: string, language: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = {
    english: [
      "I understand your concern. Can you tell me more about when these symptoms started?",
      "Based on what you've described, it's important to monitor your condition closely.",
      "Have you experienced any similar symptoms before?",
      "I recommend keeping track of your symptoms and consulting with a healthcare professional if they persist."
    ],
    hindi: [
      "मैं आपकी चिंता समझता हूं। क्या आप बता सकते हैं कि ये लक्षण कब शुरू हुए?",
      "आपने जो वर्णन किया है, उसके आधार पर अपनी स्थिति पर ध्यान देना महत्वपूर्ण है।",
      "क्या आपने पहले भी ऐसे लक्षण अनुभव किए हैं?",
      "मैं सुझाता हूं कि आप अपने लक्षणों पर नज़र रखें और यदि वे बने रहें तो स्वास्थ्य पेशेवर से सलाह लें।"
    ],
    telugu: [
      "మీ ఆందోళన నేను అర్థం చేసుకున్నాను. ఈ లక్షణాలు ఎప్పుడు మొదలయ్యాయో చెప్పగలరా?",
      "మీరు వివరించిన దాని ఆధారంగా, మీ పరిస్థితిని దగ్గరగా పర్యవేక్షించడం ముఖ్యం.",
      "మీరు ఇంతకు మునుపు ఇలాంటి లక్షణాలను అనుభవించారా?",
      "మీ లక్షణాలను ట్రాక్ చేయడం మరియు అవి కొనసాగితే ఆరోగ్య నిపుణుడిని సంప్రదించాలని నేను సిఫార్సు చేస్తున్నాను."
    ]
  };
  
  const languageResponses = responses[language as keyof typeof responses] || responses.english;
  return languageResponses[Math.floor(Math.random() * languageResponses.length)];
};