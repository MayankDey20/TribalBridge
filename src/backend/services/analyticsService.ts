import { supabase } from '../lib/supabase';

export interface UserStats {
  translationCount: number;
  contributionScore: number;
  totalCharactersTranslated: number;
  averageAccuracy: number;
  languagesUsed: string[];
  recentActivity: Array<{
    date: string;
    count: number;
  }>;
}

export interface LanguageStats {
  code: string;
  name: string;
  translationCount: number;
  averageAccuracy: number;
  mostCommonPairs: Array<{
    source: string;
    target: string;
    count: number;
  }>;
}

/**
 * Analytics Service
 * Provides statistics and insights about translations and usage
 */
export const analyticsService = {
  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Get translation data
      const { data: translations } = await supabase
        .from('translations')
        .select('source_language_code, target_language_code, accuracy_score, character_count, created_at')
        .eq('user_id', userId);

      const languagesUsed = new Set<string>();
      let totalCharacters = 0;
      let totalAccuracy = 0;
      let accuracyCount = 0;

      translations?.forEach(t => {
        languagesUsed.add(t.source_language_code);
        languagesUsed.add(t.target_language_code);
        totalCharacters += t.character_count || 0;
        if (t.accuracy_score) {
          totalAccuracy += t.accuracy_score;
          accuracyCount++;
        }
      });

      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentActivity = this.aggregateActivityByDate(
        translations?.filter(t => new Date(t.created_at) >= thirtyDaysAgo) || []
      );

      return {
        translationCount: profile?.translation_count || 0,
        contributionScore: profile?.contribution_score || 0,
        totalCharactersTranslated: totalCharacters,
        averageAccuracy: accuracyCount > 0 ? totalAccuracy / accuracyCount : 0,
        languagesUsed: Array.from(languagesUsed),
        recentActivity
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        translationCount: 0,
        contributionScore: 0,
        totalCharactersTranslated: 0,
        averageAccuracy: 0,
        languagesUsed: [],
        recentActivity: []
      };
    }
  },

  /**
   * Get language statistics
   */
  async getLanguageStats(languageCode: string): Promise<LanguageStats> {
    try {
      // Get language info
      const { data: language } = await supabase
        .from('tribal_languages')
        .select('code, name')
        .eq('code', languageCode)
        .single();

      // Get translation data
      const { data: translations } = await supabase
        .from('translations')
        .select('source_language_code, target_language_code, accuracy_score')
        .or(`source_language_code.eq.${languageCode},target_language_code.eq.${languageCode}`);

      let totalAccuracy = 0;
      let accuracyCount = 0;
      const pairCounts = new Map<string, number>();

      translations?.forEach(t => {
        if (t.accuracy_score) {
          totalAccuracy += t.accuracy_score;
          accuracyCount++;
        }

        const pair = `${t.source_language_code}->${t.target_language_code}`;
        pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);
      });

      const mostCommonPairs = Array.from(pairCounts.entries())
        .map(([pair, count]) => {
          const [source, target] = pair.split('->');
          return { source, target, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        code: languageCode,
        name: language?.name || languageCode,
        translationCount: translations?.length || 0,
        averageAccuracy: accuracyCount > 0 ? totalAccuracy / accuracyCount : 0,
        mostCommonPairs
      };
    } catch (error) {
      console.error('Error fetching language stats:', error);
      return {
        code: languageCode,
        name: languageCode,
        translationCount: 0,
        averageAccuracy: 0,
        mostCommonPairs: []
      };
    }
  },

  /**
   * Get global platform statistics
   */
  async getGlobalStats() {
    try {
      const { count: totalTranslations } = await supabase
        .from('translations')
        .select('*', { count: 'exact', head: true });

      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: totalLanguages } = await supabase
        .from('tribal_languages')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      return {
        totalTranslations: totalTranslations || 0,
        totalUsers: totalUsers || 0,
        totalLanguages: totalLanguages || 0
      };
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return {
        totalTranslations: 0,
        totalUsers: 0,
        totalLanguages: 0
      };
    }
  },

  /**
   * Helper function to aggregate activity by date
   */
  aggregateActivityByDate(translations: any[]): Array<{ date: string; count: number }> {
    const activityMap = new Map<string, number>();

    translations.forEach(t => {
      const date = new Date(t.created_at).toISOString().split('T')[0];
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });

    return Array.from(activityMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Track translation feedback
   */
  async addTranslationFeedback(data: {
    translationId: string;
    userId: string;
    feedbackType: 'accuracy' | 'cultural_appropriateness' | 'technical_issue';
    rating: number;
    comment?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('translation_feedback')
        .insert({
          translation_id: data.translationId,
          user_id: data.userId,
          feedback_type: data.feedbackType,
          rating: data.rating,
          comment: data.comment
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding feedback:', error);
      return false;
    }
  }
};
