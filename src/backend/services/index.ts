// Export all services from a central location
export { languageService } from './languageService';
export { translationService } from './translationService';
export { voiceService } from './voiceService';
export { analyticsService } from './analyticsService';

// Re-export types
export type { TranslationRequest, TranslationResponse } from './translationService';
export type { VoiceRecognitionOptions, VoiceRecognitionResult } from './voiceService';
export type { UserStats, LanguageStats } from './analyticsService';
