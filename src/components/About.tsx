import React from 'react';
import { Shield, Heart, Users, Zap } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface AboutProps {
  language: string;
}

const About: React.FC<AboutProps> = ({ language }) => {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze symptoms for accurate preliminary assessments.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Multilingual Support',
      description: 'Communicate in English, Hindi, or Telugu for better accessibility and understanding.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Privacy Focused',
      description: 'Your health information is processed securely with complete privacy protection.'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Healthcare Bridge',
      description: 'Connects users with preliminary insights while encouraging professional medical care.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {getTranslation('about', language)} {getTranslation('appTitle', language)}
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          {getTranslation('aboutText', language)}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 rounded-lg p-2 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>
            </div>
            <p className="text-gray-700">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Important Medical Disclaimer
            </h3>
            <p className="text-yellow-800 leading-relaxed">
              {getTranslation('disclaimer', language)}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-blue-50 rounded-xl">
          <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
          <div className="text-blue-800 font-medium">Languages Supported</div>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
          <div className="text-green-800 font-medium">Always Available</div>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-xl">
          <div className="text-3xl font-bold text-purple-600 mb-2">AI</div>
          <div className="text-purple-800 font-medium">Powered Analysis</div>
        </div>
      </div>
    </div>
  );
};

export default About;