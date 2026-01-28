/**
 * Voice Service
 * Handles voice input (Speech-to-Text) and output (Text-to-Speech)
 * Uses Web Speech API (built into modern browsers)
 */

export interface VoiceRecognitionOptions {
  language: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export const voiceService = {
  recognition: null as SpeechRecognition | null,
  synthesis: window.speechSynthesis,

  /**
   * Check if browser supports speech recognition
   */
  isRecognitionSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  /**
   * Check if browser supports speech synthesis
   */
  isSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  },

  /**
   * Start voice recognition
   */
  startRecognition(
    options: VoiceRecognitionOptions,
    onResult: (result: VoiceRecognitionResult) => void,
    onError: (error: string) => void
  ): void {
    if (!this.isRecognitionSupported()) {
      onError('Speech recognition is not supported in your browser. Try Chrome or Edge.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = options.continuous ?? false;
      this.recognition.interimResults = options.interimResults ?? true;
      this.recognition.lang = this.getLanguageCode(options.language);
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.results.length - 1];
        onResult({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal
        });
      };

      this.recognition.onerror = (event: any) => {
        let errorMessage = 'Speech recognition error';
        
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Check your device.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Enable it in browser settings.';
            break;
          case 'network':
            errorMessage = 'Network error. Check your internet connection.';
            break;
          case 'aborted':
            errorMessage = 'Recording aborted.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        onError(errorMessage);
      };

      this.recognition.onend = () => {};

      this.recognition.start();
    } catch (error) {
      onError('Failed to start speech recognition. Grant microphone permission and try again.');
    }
  },

  /**
   * Stop voice recognition
   */
  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  },

  /**
   * Speak text (Text-to-Speech)
   */
  speak(text: string, language: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSynthesisSupported()) {
        reject(new Error('Speech synthesis is not supported in your browser'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language);
      utterance.rate = options?.rate ?? 0.9;
      utterance.pitch = options?.pitch ?? 1.0;
      utterance.volume = options?.volume ?? 1.0;

      utterance.onend = () => {
        resolve();
      };
      
      utterance.onerror = (event) => {
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      // Wait for voices to load
      const speakWithVoice = () => {
        const voices = this.synthesis.getVoices();
        
        if (voices.length > 0) {
          // Try to find a voice for the specified language
          const langCode = this.getLanguageCode(language);
          const languageVoice = voices.find(voice => voice.lang.startsWith(langCode));
          
          if (languageVoice) {
            utterance.voice = languageVoice;
          }
        }

        this.synthesis.speak(utterance);
      };

      // Voices might not be loaded yet
      if (this.synthesis.getVoices().length === 0) {
        this.synthesis.onvoiceschanged = () => {
          speakWithVoice();
        };
      } else {
        speakWithVoice();
      }
    });
  },

  /**
   * Stop speaking
   */
  stopSpeaking(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  },

  /**
   * Get available voices for a language
   */
  getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    const voices = this.synthesis.getVoices();
    const langCode = this.getLanguageCode(language);
    return voices.filter(voice => voice.lang.startsWith(langCode));
  },

  /**
   * Convert language code to speech API format
   */
  getLanguageCode(languageCode: string): string {
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'gon': 'hi-IN', // Gondi uses Hindi voice
      'sat': 'hi-IN', // Santali uses Hindi voice
      'ho': 'hi-IN', // Ho uses Hindi voice
      'bod': 'hi-IN', // Bodo uses Hindi voice
      'brx': 'hi-IN', // Bodo uses Hindi voice
      'kru': 'hi-IN', // Kurukh uses Hindi voice
      'lus': 'hi-IN', // Mizo uses Hindi voice
      'nv': 'en-US', // Navajo uses English voice (no native support)
      'chr': 'en-US', // Cherokee uses English voice
      'oj': 'en-US', // Ojibwe uses English voice
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'pt': 'pt-BR',
      'ru': 'ru-RU',
      'ar': 'ar-SA'
    };

    return languageMap[languageCode] || 'en-US';
  },

  /**
   * Load voices (needed for some browsers)
   */
  loadVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }

      this.synthesis.onvoiceschanged = () => {
        resolve(this.synthesis.getVoices());
      };
    });
  }
};
