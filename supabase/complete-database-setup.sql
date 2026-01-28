
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_translation_count_trigger ON translations;
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_translation_count() CASCADE;
DROP FUNCTION IF EXISTS auto_confirm_user() CASCADE;

DROP TABLE IF EXISTS language_contributions CASCADE;
DROP TABLE IF EXISTS translation_feedback CASCADE;
DROP TABLE IF EXISTS translations CASCADE;
DROP TABLE IF EXISTS tribal_languages CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS translation_type CASCADE;
DROP TYPE IF EXISTS feedback_type CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('admin', 'contributor', 'user');
CREATE TYPE translation_type AS ENUM ('text', 'audio', 'document');
CREATE TYPE feedback_type AS ENUM ('accuracy', 'cultural_appropriateness', 'technical_issue');

CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  role user_role DEFAULT 'user',
  preferred_language text DEFAULT 'en',
  bio text,
  profile_image_url text,
  translation_count integer DEFAULT 0,
  contribution_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE tribal_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  native_name text NOT NULL,
  region text,
  country text DEFAULT 'India',
  speakers_count integer,
  language_family text,
  script text,
  is_active boolean DEFAULT true,
  description text,
  language_status text DEFAULT 'vulnerable',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  source_language_code text NOT NULL,
  target_language_code text NOT NULL,
  source_text text NOT NULL,
  translated_text text NOT NULL,
  translation_type translation_type DEFAULT 'text',
  confidence_score decimal(3,2),
  model_used text,
  processing_time_ms integer,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE translation_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_id uuid REFERENCES translations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  feedback_type feedback_type NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE language_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  language_code text NOT NULL,
  contribution_type text NOT NULL,
  source_text text,
  target_text text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tribal_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE language_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public profiles viewable"
  ON profiles FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Languages viewable by all"
  ON tribal_languages FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Users read own translations"
  ON translations FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create translations"
  ON translations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own translations"
  ON translations FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own translations"
  ON translations FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users read feedback"
  ON translation_feedback FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users create feedback"
  ON translation_feedback FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Contributors read own"
  ON language_contributions FOR SELECT TO authenticated
  USING (auth.uid() = contributor_id);

CREATE POLICY "Contributors create"
  ON language_contributions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = contributor_id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION update_translation_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles
    SET translation_count = translation_count + 1
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles
    SET translation_count = GREATEST(0, translation_count - 1)
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_translation_count_trigger
  AFTER INSERT OR DELETE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_translation_count();

CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  NEW.confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();



INSERT INTO tribal_languages (name, code, native_name, region, country, speakers_count, language_family, script, description, language_status) VALUES
('Gondi', 'gon', 'गोंडी', 'Central India', 'India', 2900000, 'Dravidian', 'Devanagari', 'Gondi is a South-Central Dravidian language, spoken by about 2.9 million Gond people.', 'vulnerable'),
('Santali', 'sat', 'ᱥᱟᱱᱛᱟᱲᱤ', 'Eastern India', 'India', 7368192, 'Austroasiatic', 'Ol Chiki', 'Santali is the most widely-spoken language of the Munda subfamily of Austroasiatic languages.', 'vulnerable'),
('Kurukh', 'kru', 'कुड़ुख़', 'Central/Eastern India', 'India', 2000000, 'Dravidian', 'Devanagari', 'Kurukh is a Northern Dravidian language spoken by the Oraon people.', 'vulnerable'),
('Mizo', 'lus', 'Mizo', 'Mizoram', 'India', 830000, 'Sino-Tibetan', 'Latin', 'Mizo is a Sino-Tibetan language spoken natively by the Mizo people.', 'safe'),
('Ho', 'hoc', 'Ho', 'Jharkhand', 'India', 1040000, 'Austroasiatic', 'Devanagari', 'Ho is a Munda language of the Austroasiatic language family.', 'vulnerable'),
('Bodo', 'brx', 'बोडो', 'Assam', 'India', 1350478, 'Sino-Tibetan', 'Devanagari', 'Bodo is a Sino-Tibetan language spoken primarily by the Bodo people.', 'vulnerable'),
('Navajo', 'nv', 'Diné bizaad', 'Southwest US', 'United States', 170000, 'Dené-Yeniseian', 'Latin', 'Navajo is the most widely spoken Native American language.', 'vulnerable'),
('Cherokee', 'chr', 'ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ', 'Southeast US', 'United States', 2000, 'Iroquoian', 'Cherokee syllabary', 'Cherokee is an Iroquoian language with its own unique syllabary.', 'severely_endangered'),
('Ojibwe', 'oj', 'ᐊᓂᔑᓈᐯᒧᐎᓐ', 'Great Lakes', 'United States/Canada', 50000, 'Algonquian', 'Latin/Syllabics', 'Ojibwe is an Algonquian language spoken by the Anishinaabe people.', 'definitely_endangered'),
('Cree', 'cr', 'ᓀᐦᐃᔭᐐᐏᐣ', 'Canada', 'Canada', 117000, 'Algonquian', 'Syllabics', 'Cree is an Algonquian language spoken across Canada.', 'vulnerable'),
('Inuktitut', 'iu', 'ᐃᓄᒃᑎᑐᑦ', 'Arctic Canada', 'Canada', 40000, 'Eskimo-Aleut', 'Syllabics', 'Inuktitut is the language of the Inuit people.', 'vulnerable'),
('Lakota', 'lkt', 'Lakȟótiyapi', 'Great Plains', 'United States', 2000, 'Siouan', 'Latin', 'Lakota is a Siouan language spoken by the Lakota people.', 'severely_endangered'),
('Quechua', 'qu', 'Runa Simi', 'Andes', 'Peru/Bolivia/Ecuador', 8000000, 'Quechuan', 'Latin', 'Quechua is descended from the language of the Inca Empire.', 'vulnerable'),
('Māori', 'mi', 'Te Reo Māori', 'New Zealand', 'New Zealand', 185000, 'Austronesian', 'Latin', 'Māori is the language of the indigenous Polynesian people of New Zealand.', 'vulnerable'),
('Sami', 'se', 'Sámegiella', 'Lapland', 'Norway/Sweden/Finland', 30000, 'Uralic', 'Latin', 'Sami languages are spoken by the Sami people in Lapland.', 'definitely_endangered'),
('Ainu', 'ain', 'アイヌ・イタㇰ', 'Hokkaido', 'Japan', 10, 'Isolated', 'Katakana', 'Ainu is the language of the indigenous Ainu people of northern Japan.', 'critically_endangered'),
('Tulu', 'tcy', 'ತುಳು', 'Karnataka', 'India', 1846427, 'Dravidian', 'Kannada', 'Tulu is a Dravidian language spoken in coastal Karnataka.', 'vulnerable'),
('Khasi', 'kha', 'কা কতিয়েন খাশি', 'Meghalaya', 'India', 1128575, 'Austroasiatic', 'Latin/Bengali', 'Khasi is an Austroasiatic language spoken in Meghalaya.', 'vulnerable');

CREATE INDEX idx_translations_user_created ON translations(user_id, created_at DESC);
CREATE INDEX idx_translations_languages ON translations(source_language_code, target_language_code);
CREATE INDEX idx_tribal_languages_active ON tribal_languages(is_active) WHERE is_active = true;
CREATE INDEX idx_profiles_role ON profiles(role);
