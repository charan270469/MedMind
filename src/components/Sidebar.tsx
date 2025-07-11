import React from 'react';
import { Home, Info, Activity, Globe, MapPin } from 'lucide-react';
import { getTranslation } from '../utils/translations';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language, setLanguage }) => {
  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'telugu', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  return (
    <div className="bg-white h-screen w-64 shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 rounded-lg p-2">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {getTranslation('appTitle', language)}
            </h1>
            <p className="text-xs text-gray-600">
              {getTranslation('tagline', language)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'home'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">{getTranslation('home', language)}</span>
        </button>

        <button
          onClick={() => setActiveTab('hospitals')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'hospitals'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MapPin className="h-5 w-5" />
          <span className="font-medium">{getTranslation('hospitalsNearYou', language)}</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'about'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Info className="h-5 w-5" />
          <span className="font-medium">{getTranslation('about', language)}</span>
        </button>
      </nav>

      {/* Language Selector */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 mb-3">
          <Globe className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Language</span>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Sidebar;