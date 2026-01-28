import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'contributor' | 'user';
  created_at: string;
  profile: {
    full_name?: string;
    preferred_language?: string;
  };
}

export interface Translation {
  id: string;
  user_id: string;
  source_language: string;
  target_language: string;
  source_text: string;
  translated_text: string;
  confidence_score?: number;
  translation_type: 'text' | 'audio' | 'document';
  created_at: string;
}

export interface TribalLanguage {
  id: string;
  name: string;
  code: string;
  region: string;
  speakers_count?: number;
  is_active: boolean;
  description?: string;
  created_at: string;
}