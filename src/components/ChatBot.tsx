import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatBotProps {
  language: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      language: language as any
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Add to conversation history
    const newHistory = [...conversationHistory, `User: ${inputMessage}`];
    setConversationHistory(newHistory);
    
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await geminiService.chatResponse(inputMessage, language, newHistory);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        language: language as any
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Add bot response to history
      setConversationHistory(prev => [...prev, `Bot: ${response}`]);
      
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getTranslation('chatError', language),
        sender: 'bot',
        timestamp: new Date(),
        language: language as any
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getWelcomeMessage = () => {
    const welcomeMessages = {
      english: "Hello! I'm your AI health assistant. I'm here to help with your health concerns and questions. How can I assist you today?",
      hindi: "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। मैं आपकी स्वास्थ्य संबंधी चिंताओं और प्रश्नों में मदद करने के लिए यहां हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      telugu: "హలో! నేను మీ AI ఆరోగ్య సహాయకుడను. మీ ఆరోగ్య సమస్యలు మరియు ప్రశ్నలతో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?"
    };
    return welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages.english;
  };

  // Initialize with welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: getWelcomeMessage(),
        sender: 'bot',
        timestamp: new Date(),
        language: language as any
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, language]);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 hover:scale-105 transform"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Chat Window */}
          <div 
            className="bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col w-full max-w-4xl h-[80vh] max-h-[600px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-600 text-white rounded-t-xl">
              <div className="flex items-center space-x-3">
                <Bot className="h-6 w-6" />
                <div>
                  <h2 className="text-lg font-semibold">
                    {getTranslation('chatWithAI', language)}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    AI Health Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-blue-700 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.sender === 'bot' && (
                        <Bot className="h-5 w-5 mt-1 flex-shrink-0 text-blue-600" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-5 w-5 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-200 bg-white rounded-b-xl">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={getTranslation('typeMessage', language)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-medium"
                >
                  {isTyping ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;