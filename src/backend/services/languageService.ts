import { supabase } from '../lib/supabase';
import type { TribalLanguage } from '../lib/supabase';

/**
 * Language Service
 * Handles all operations related to tribal languages
 */
export const languageService = {
  /**
   * Fetch all active tribal languages from the database
   */
  async getAllLanguages(): Promise<TribalLanguage[]> {
    try {
      const { data, error } = await supabase
        .from('tribal_languages')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  },

  /**
   * Get a specific language by its code
   */
  async getLanguageByCode(code: string): Promise<TribalLanguage | null> {
    try {
      const { data, error } = await supabase
        .from('tribal_languages')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching language:', error);
      return null;
    }
  },

  /**
   * Get languages by region
   */
  async getLanguagesByRegion(region: string): Promise<TribalLanguage[]> {
    try {
      const { data, error } = await supabase
        .from('tribal_languages')
        .select('*')
        .eq('region', region)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching languages by region:', error);
      throw error;
    }
  },

  /**
   * Search languages by name
   */
  async searchLanguages(query: string): Promise<TribalLanguage[]> {
    try {
      const { data, error } = await supabase
        .from('tribal_languages')
        .select('*')
        .or(`name.ilike.%${query}%,native_name.ilike.%${query}%`)
        .eq('is_active', true)
        .order('name', { ascending: true })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching languages:', error);
      throw error;
    }
  },

  /**
   * Get language statistics
   */
  async getLanguageStats(languageCode: string) {
    try {
      const { count, error } = await supabase
        .from('translations')
        .select('*', { count: 'exact', head: true })
        .or(`source_language_code.eq.${languageCode},target_language_code.eq.${languageCode}`);

      if (error) throw error;
      return { translationCount: count || 0 };
    } catch (error) {
      console.error('Error fetching language stats:', error);
      return { translationCount: 0 };
    }
  }
};
