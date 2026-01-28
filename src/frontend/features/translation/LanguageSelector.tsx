import React from 'react';
import { ChevronDown, Globe, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../../../backend/languages';

interface LanguageSelectorProps {
  selectedLanguage: Language | null;
  onLanguageSelect: (language: Language) => void;
  isOpen: boolean;
  onToggle: () => void;
  placeholder?: string;
  languages: Language[];
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageSelect,
  isOpen,
  onToggle,
  placeholder = 'Select language',
  languages,
}: LanguageSelectorProps) {
  const tribalLanguages = languages.filter(lang => lang.isTribal);
  const majorLanguages = languages.filter(lang => !lang.isTribal);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critically_endangered': return 'text-red-600 bg-red-100';
      case 'severely_endangered': return 'text-orange-600 bg-orange-100';
      case 'definitely_endangered': return 'text-yellow-600 bg-yellow-100';
      case 'vulnerable': return 'text-blue-600 bg-blue-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'critically_endangered' || status === 'severely_endangered') {
      return <AlertTriangle size={12} className="text-red-500" />;
    }
    return null;
  };

  const formatSpeakers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-primary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Globe size={18} className="text-gray-400" />
          <div className="text-left">
            <span className="text-gray-900 block">
              {selectedLanguage ? selectedLanguage.name : placeholder}
            </span>
            {selectedLanguage && (
              <span className="text-xs text-gray-500">
                {selectedLanguage.nativeName} • {formatSpeakers(selectedLanguage.speakers)} speakers
              </span>
            )}
          </div>
          {selectedLanguage?.isTribal && (
            <div className="flex items-center space-x-1">
              {getStatusIcon(selectedLanguage.status)}
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedLanguage.status)}`}>
                {selectedLanguage.status.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
        <ChevronDown 
          size={18} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          >
            {tribalLanguages.length > 0 && (
              <div>
                <div className="px-3 py-2 bg-primary-50 text-primary-700 text-sm font-medium border-b border-gray-100 sticky top-0">
                  Indigenous & Tribal Languages ({tribalLanguages.length})
                </div>
                {tribalLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      onLanguageSelect(language);
                      onToggle();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-primary-50 focus:bg-primary-50 focus:outline-none transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{language.name}</span>
                          {getStatusIcon(language.status)}
                        </div>
                        <div className="text-sm text-gray-500">{language.nativeName}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {language.region} • {formatSpeakers(language.speakers)} speakers
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(language.status)}`}>
                          {language.status.replace('_', ' ')}
                        </span>
                        {language.family && (
                          <span className="text-xs text-gray-400">{language.family}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {majorLanguages.length > 0 && (
              <div>
                <div className="px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium border-b border-gray-100 sticky top-0">
                  Major World Languages ({majorLanguages.length})
                </div>
                {majorLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      onLanguageSelect(language);
                      onToggle();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{language.name}</div>
                        <div className="text-sm text-gray-500">{language.nativeName}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {language.region} • {formatSpeakers(language.speakers)} speakers
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">{language.family}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}