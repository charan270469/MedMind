import React, { useState } from 'react';
import { Search, AlertTriangle, Clock, TrendingUp, Stethoscope, Loader2, MapPin } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import { geminiService } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface SymptomCheckerProps {
  language: string;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ language }) => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await geminiService.analyzeSymptoms(symptoms, language);
      setResult(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(getTranslation('analysisError', language));
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: number) => {
    switch (urgency) {
      case 5: return 'bg-red-100 text-red-800 border-red-200';
      case 4: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'doctor': return <Stethoscope className="h-4 w-4" />;
      case 'otc': return <Clock className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getActionText = (action: string) => {
    const actionTranslations = {
      emergency: {
        english: 'Emergency Care',
        hindi: 'आपातकालीन देखभाल',
        telugu: 'అత్యవసర సంరక్షణ'
      },
      doctor: {
        english: 'See Doctor',
        hindi: 'डॉक्टर से मिलें',
        telugu: 'వైద్యుడిని చూడండి'
      },
      otc: {
        english: 'Over-the-Counter',
        hindi: 'ओवर-द-काउंटर',
        telugu: 'ఓవర్-ది-కౌంటర్'
      },
      rest: {
        english: 'Rest & Monitor',
        hindi: 'आराम और निगरानी',
        telugu: 'విశ్రాంతి మరియు పర్యవేక్షణ'
      }
    };

    return actionTranslations[action as keyof typeof actionTranslations]?.[language as keyof typeof actionTranslations.emergency] || action;
  };

  const findNearestHospital = () => {
    // Get user location and redirect to Google Maps for nearest hospital
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/search/hospital+near+me/@${latitude},${longitude},15z`;
          window.open(url, '_blank');
        },
        (error) => {
          console.error('Location error:', error);
          // Fallback to general hospital search
          window.open('https://www.google.com/maps/search/hospital+near+me', '_blank');
        }
      );
    } else {
      // Fallback if geolocation is not supported
      window.open('https://www.google.com/maps/search/hospital+near+me', '_blank');
    }
  };

  const hasEmergencySymptoms = (result: AnalysisResult): boolean => {
    return result.urgency_level >= 4 || result.possible_conditions.some(condition => 
      condition.urgency >= 4 || condition.action === 'emergency'
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {getTranslation('symptomChecker', language)}
        </h2>
        <p className="text-gray-600">
          {getTranslation('describeSymptoms', language)}
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder={getTranslation('symptomPlaceholder', language)}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={loading}
          maxLength={500}
        />
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {symptoms.length}/500 characters
          </span>
          <button
            onClick={handleAnalyze}
            disabled={loading || !symptoms.trim()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>
              {loading 
                ? getTranslation('analyzing', language)
                : getTranslation('analyze', language)
              }
            </span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Emergency Alert with Hospital Button */}
          {hasEmergencySymptoms(result) && (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
                  <div>
                    <p className="text-red-800 font-semibold text-lg">
                      {getTranslation('emergency', language)}
                    </p>
                    <p className="text-red-700 mt-1">
                      Seek immediate medical attention
                    </p>
                  </div>
                </div>
                <button
                  onClick={findNearestHospital}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 font-medium"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Find Hospital</span>
                </button>
              </div>
            </div>
          )}

          {/* Possible Conditions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {getTranslation('possibleConditions', language)}
            </h3>
            
            <div className="space-y-4">
              {result.possible_conditions.map((condition, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-medium text-gray-900">
                      {condition.name}
                    </h4>
                    <div className="flex space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getTranslation('confidence', language)}: {condition.confidence}%
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(condition.urgency)}`}>
                        {getTranslation('urgency', language)}: {condition.urgency}/5
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{condition.overview}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      {getActionIcon(condition.action)}
                      <span className="font-medium text-gray-900">
                        {getTranslation('recommendedAction', language)}:
                      </span>
                      <span className="text-gray-700">{getActionText(condition.action)}</span>
                    </div>
                    
                    {(condition.urgency >= 4 || condition.action === 'emergency') && (
                      <button
                        onClick={findNearestHospital}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 text-sm"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Visit Hospital</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              {getTranslation('recommendedAction', language)}
            </h3>
            <p className="text-blue-800">{result.recommended_action}</p>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-sm text-gray-700">
              <strong>Disclaimer:</strong> {result.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;