import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SymptomChecker from './components/SymptomChecker';
import About from './components/About';
import HospitalFinder from './components/HospitalFinder';
import ChatBot from './components/ChatBot';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('english');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <SymptomChecker language={language} />;
      case 'hospitals':
        return <HospitalFinder language={language} />;
      case 'about':
        return <About language={language} />;
      default:
        return <SymptomChecker language={language} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>

      <ChatBot language={language} />
    </div>
  );
}

export default App;