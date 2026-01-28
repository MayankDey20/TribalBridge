import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Mic, Volume2, Copy, Download, Clock, Target, TrendingUp, StopCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { LanguageSelector } from './LanguageSelector';
import { toast } from 'react-hot-toast';
import { allLanguages, getLanguageByCode, Language } from '../../../backend/languages';
import { useAuth } from '../../hooks/useAuth';
import { translationService, voiceService } from '../../../backend/services';

export function TranslationInterface() {
  const { user } = useAuth();
  const [sourceLanguage, setSourceLanguage] = useState<Language | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null);
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isSourceLanguageOpen, setIsSourceLanguageOpen] = useState(false);
  const [isTargetLanguageOpen, setIsTargetLanguageOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [translationMetrics, setTranslationMetrics] = useState({
    confidence: 0,
    processingTime: 0,
    accuracy: 0,
    efficiency: 0
  });

  // Set default languages on component mount
  useEffect(() => {
    const englishLang = getLanguageByCode('en');
    const gondiLang = getLanguageByCode('gon');
    
    if (englishLang && !sourceLanguage) {
      setSourceLanguage(englishLang);
    }
    if (gondiLang && !targetLanguage) {
      setTargetLanguage(gondiLang);
    }
  }, [sourceLanguage, targetLanguage]);

  // Clear translation when source text or languages change
  useEffect(() => {
    if (translatedText) {
      setTranslatedText('');
      setTranslationMetrics({
        confidence: 0,
        processingTime: 0,
        accuracy: 0,
        efficiency: 0
      });
    }
  }, [sourceText, sourceLanguage, targetLanguage]);

  // Main translation function using backend service
  const handleTranslate = async () => {
    if (!sourceText.trim() || !sourceLanguage || !targetLanguage) {
      toast.error('Please enter text and select both languages');
      return;
    }

    if (sourceLanguage.code === targetLanguage.code) {
      toast.error('Source and target languages cannot be the same');
      return;
    }

    setIsTranslating(true);
    
    try {
      const result = await translationService.translate({
        sourceLanguageCode: sourceLanguage.code,
        targetLanguageCode: targetLanguage.code,
        sourceText: sourceText,
        userId: user?.id,
        translationType: 'text'
      });

      setTranslatedText(result.translatedText);
      setTranslationMetrics({
        confidence: Math.round(result.confidence * 100),
        processingTime: result.processingTime,
        accuracy: Math.round(result.accuracy * 100),
        efficiency: Math.round(result.efficiency * 100)
      });

      toast.success(`Translation completed with ${Math.round(result.confidence * 100)}% confidence!`);
    } catch (error) {
      toast.error('Translation failed. Please try again.');
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    if (!sourceLanguage || !targetLanguage) {
      toast.error('Please select both languages first');
      return;
    }
    
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
    
    // Reset metrics when swapping
    setTranslationMetrics({
      confidence: 0,
      processingTime: 0,
      accuracy: 0,
      efficiency: 0
    });
    
    toast.success('Languages swapped successfully!');
  };

  const handleStartRecording = () => {
    if (!sourceLanguage) {
      toast.error('Please select a source language first');
      return;
    }

    if (!voiceService.isRecognitionSupported()) {
      toast.error('Voice recognition requires Chrome or Edge browser', {
        duration: 5000
      });
      return;
    }

    setIsRecording(true);
    toast('🎤 Listening... Speak clearly now!', {
      icon: '🎤',
      duration: 10000
    });

    voiceService.startRecognition(
      {
        language: sourceLanguage.code,
        continuous: false,
        interimResults: true
      },
      (result) => {
        if (result.isFinal) {
          setSourceText(result.transcript);
          setIsRecording(false);
          toast.success(`Transcribed: "${result.transcript.substring(0, 50)}${result.transcript.length > 50 ? '...' : ''}"`);
        }
      },
      (error) => {
        setIsRecording(false);
        toast.error(error, { duration: 6000 });
      }
    );
  };

  const handleStopRecording = () => {
    voiceService.stopRecognition();
    setIsRecording(false);
    toast.info('Recording stopped');
  };

  const handlePlayAudio = async () => {
    if (!translatedText || !targetLanguage) {
      toast.error('Translate text first to hear the pronunciation');
      return;
    }

    if (!voiceService.isSynthesisSupported()) {
      toast.error('Text-to-speech is not supported in your browser');
      return;
    }

    setIsSpeaking(true);
    toast('🔊 Playing audio...', { icon: '🔊' });

    try {
      await voiceService.speak(translatedText, targetLanguage.code, {
        rate: 0.85, // Slightly slower for better clarity
        pitch: 1.0,
        volume: 1.0
      });
      setIsSpeaking(false);
      toast.success('Audio playback complete');
    } catch (error) {
      setIsSpeaking(false);
      console.error('TTS error:', error);
      toast.error('Failed to play audio. Try a different browser or language.', {
        duration: 5000
      });
    }
  };

  const handleStopAudio = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
    toast.info('Audio stopped');
  };

  const handleCopy = (text: string) => {
    if (!text) {
      toast.error('No text to copy');
      return;
    }
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard!');
  };

  const handleDownload = () => {
    if (!translatedText || !sourceLanguage || !targetLanguage) {
      toast.error('Complete a translation first');
      return;
    }
    
    const content = `TribalBridge Translation Report
Generated on: ${new Date().toLocaleString()}

Source Language: ${sourceLanguage.name} (${sourceLanguage.nativeName})
Target Language: ${targetLanguage.name} (${targetLanguage.nativeName})
Confidence: ${translationMetrics.confidence}%
Accuracy: ${translationMetrics.accuracy}%
Processing Time: ${translationMetrics.processingTime}ms
Efficiency: ${translationMetrics.efficiency}% vs general translators

Original Text:
${sourceText}

Translation:
${translatedText}

Generated by TribalBridge AI - Preserving Indigenous Voices
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tribalbridge-translation-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Translation report downloaded successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Language Selection */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <LanguageSelector
              selectedLanguage={sourceLanguage}
              onLanguageSelect={(lang) => {
                setSourceLanguage(lang);
                setIsSourceLanguageOpen(false);
              }}
              isOpen={isSourceLanguageOpen}
              onToggle={() => {
                setIsSourceLanguageOpen(!isSourceLanguageOpen);
                setIsTargetLanguageOpen(false);
              }}
              placeholder="Source language"
              languages={allLanguages}
            />
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeftRight}
              onClick={handleSwapLanguages}
              className="rounded-full"
              disabled={!sourceLanguage || !targetLanguage}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <LanguageSelector
              selectedLanguage={targetLanguage}
              onLanguageSelect={(lang) => {
                setTargetLanguage(lang);
                setIsTargetLanguageOpen(false);
              }}
              isOpen={isTargetLanguageOpen}
              onToggle={() => {
                setIsTargetLanguageOpen(!isTargetLanguageOpen);
                setIsSourceLanguageOpen(false);
              }}
              placeholder="Target language"
              languages={allLanguages}
            />
          </div>
        </div>
      </Card>

      {/* Translation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">
              {sourceLanguage ? sourceLanguage.name : 'Source Text'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon={Mic}
              onClick={handleStartRecording}
              loading={isRecording}
              className={isRecording ? 'text-red-500' : ''}
            >
              {isRecording ? 'Recording...' : 'Voice'}
            </Button>
          </div>
          
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={sourceLanguage ? `Enter text in ${sourceLanguage.name}...` : "Enter text to translate..."}
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
          />
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              {sourceText.length} characters • {sourceText.split(' ').filter(word => word.length > 0).length} words
            </span>
            <Button
              variant="primary"
              onClick={handleTranslate}
              loading={isTranslating}
              disabled={!sourceText.trim() || !sourceLanguage || !targetLanguage}
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </Button>
          </div>
        </Card>

        {/* Translated Text */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">
              {targetLanguage ? targetLanguage.name : 'Translation'}
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Volume2}
                onClick={handlePlayAudio}
                disabled={!translatedText}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={Copy}
                onClick={() => handleCopy(translatedText)}
                disabled={!translatedText}
              />
              <Button
                variant="ghost"
                size="sm"
                icon={Download}
                onClick={handleDownload}
                disabled={!translatedText}
              />
            </div>
          </div>
          
          <div className="w-full h-40 p-4 bg-gray-50 border border-gray-300 rounded-lg overflow-y-auto">
            {isTranslating ? (
              <motion.div
                className="flex items-center justify-center h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : translatedText ? (
              <p className="text-gray-900">{translatedText}</p>
            ) : (
              <p className="text-gray-500 italic">Translation will appear here...</p>
            )}
          </div>
          
          {translatedText && translationMetrics.confidence > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-semibold text-green-600">{translationMetrics.confidence}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">{translationMetrics.processingTime}ms</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-semibold text-purple-600">{translationMetrics.accuracy}%</span>
                </div>
                <span className="text-primary-600 font-medium">
                  {translationMetrics.efficiency}% efficiency vs. general translators
                </span>
              </div>
              
              <div className="bg-primary-50 rounded-lg p-3 mt-3">
                <p className="text-xs text-primary-700">
                  <strong>TribalBridge Advantage:</strong> Our specialized AI models achieve superior 
                  accuracy for indigenous languages compared to general-purpose translators 
                  (60-70% typical accuracy).
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}