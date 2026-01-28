export interface Language {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  country: string;
  speakers: number;
  status: 'critically_endangered' | 'severely_endangered' | 'definitely_endangered' | 'vulnerable' | 'safe';
  family: string;
  script?: string;
  isTribal?: boolean;
  description?: string;
}

export const majorLanguages: Language[] = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English', 
    region: 'Global', 
    country: 'United Kingdom', 
    speakers: 1500000000, 
    status: 'safe',
    family: 'Indo-European'
  },
  { 
    code: 'hi', 
    name: 'Hindi', 
    nativeName: 'हिन्दी', 
    region: 'North India', 
    country: 'India', 
    speakers: 600000000, 
    status: 'safe',
    family: 'Indo-European',
    script: 'Devanagari'
  },
  { 
    code: 'bn', 
    name: 'Bengali', 
    nativeName: 'বাংলা', 
    region: 'Bengal', 
    country: 'Bangladesh', 
    speakers: 300000000, 
    status: 'safe',
    family: 'Indo-European',
    script: 'Bengali'
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español', 
    region: 'Global', 
    country: 'Spain', 
    speakers: 500000000, 
    status: 'safe',
    family: 'Indo-European'
  },
  { 
    code: 'fr', 
    name: 'French', 
    nativeName: 'Français', 
    region: 'Global', 
    country: 'France', 
    speakers: 280000000, 
    status: 'safe',
    family: 'Indo-European'
  },
  { 
    code: 'de', 
    name: 'German', 
    nativeName: 'Deutsch', 
    region: 'Central Europe', 
    country: 'Germany', 
    speakers: 100000000, 
    status: 'safe',
    family: 'Indo-European'
  },
  { 
    code: 'pt', 
    name: 'Portuguese', 
    nativeName: 'Português', 
    region: 'Global', 
    country: 'Portugal', 
    speakers: 260000000, 
    status: 'safe',
    family: 'Indo-European'
  },
  { 
    code: 'zh', 
    name: 'Chinese', 
    nativeName: '中文', 
    region: 'East Asia', 
    country: 'China', 
    speakers: 1100000000, 
    status: 'safe',
    family: 'Sino-Tibetan',
    script: 'Chinese characters'
  },
  { 
    code: 'ja', 
    name: 'Japanese', 
    nativeName: '日本語', 
    region: 'Japan', 
    country: 'Japan', 
    speakers: 125000000, 
    status: 'safe',
    family: 'Japonic',
    script: 'Hiragana, Katakana, Kanji'
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية', 
    region: 'Middle East', 
    country: 'Saudi Arabia', 
    speakers: 400000000, 
    status: 'safe',
    family: 'Afro-Asiatic',
    script: 'Arabic'
  },
];

export const tribalLanguages: Language[] = [
  // Indian Tribal Languages
  { 
    code: 'gon', 
    name: 'Gondi', 
    nativeName: 'गोंडी', 
    region: 'Central India', 
    country: 'India', 
    speakers: 2900000, 
    status: 'vulnerable',
    family: 'Dravidian',
    script: 'Devanagari',
    isTribal: true,
    description: 'Spoken by the Gond people, one of the largest tribal groups in India'
  },
  { 
    code: 'sat', 
    name: 'Santali', 
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', 
    region: 'Eastern India', 
    country: 'India', 
    speakers: 7368192, 
    status: 'safe',
    family: 'Austroasiatic',
    script: 'Ol Chiki',
    isTribal: true,
    description: 'Official language in Jharkhand, spoken by the Santal people'
  },
  { 
    code: 'ho', 
    name: 'Ho', 
    nativeName: 'Ho', 
    region: 'Jharkhand', 
    country: 'India', 
    speakers: 1040000, 
    status: 'vulnerable',
    family: 'Austroasiatic',
    isTribal: true,
    description: 'Spoken by the Ho people in Jharkhand and Odisha'
  },
  { 
    code: 'brx', 
    name: 'Bodo', 
    nativeName: 'बोडो', 
    region: 'Assam', 
    country: 'India', 
    speakers: 1350478, 
    status: 'vulnerable',
    family: 'Sino-Tibetan',
    script: 'Devanagari',
    isTribal: true,
    description: 'Official language of Bodoland Territorial Region in Assam'
  },
  { 
    code: 'kha', 
    name: 'Khasi', 
    nativeName: 'Ka Ktien Khasi', 
    region: 'Meghalaya', 
    country: 'India', 
    speakers: 1128575, 
    status: 'vulnerable',
    family: 'Austroasiatic',
    script: 'Latin',
    isTribal: true,
    description: 'Official language of Meghalaya state'
  },
  { 
    code: 'grt', 
    name: 'Garo', 
    nativeName: 'A·chik', 
    region: 'Meghalaya', 
    country: 'India', 
    speakers: 889000, 
    status: 'vulnerable',
    family: 'Sino-Tibetan',
    script: 'Latin',
    isTribal: true,
    description: 'Spoken by the Garo people in Meghalaya and Bangladesh'
  },
  { 
    code: 'mni', 
    name: 'Manipuri', 
    nativeName: 'ꯃꯤꯇꯩ ꯂꯣꯟ', 
    region: 'Manipur', 
    country: 'India', 
    speakers: 1760000, 
    status: 'vulnerable',
    family: 'Sino-Tibetan',
    script: 'Meitei Mayek',
    isTribal: true,
    description: 'Official language of Manipur, also known as Meitei'
  },
  { 
    code: 'lus', 
    name: 'Mizo', 
    nativeName: 'Mizo ṭawng', 
    region: 'Mizoram', 
    country: 'India', 
    speakers: 830846, 
    status: 'vulnerable',
    family: 'Sino-Tibetan',
    script: 'Latin',
    isTribal: true,
    description: 'Official language of Mizoram state'
  },
  { 
    code: 'kru', 
    name: 'Kurukh', 
    nativeName: 'कुड़ुख़', 
    region: 'Jharkhand', 
    country: 'India', 
    speakers: 2053000, 
    status: 'vulnerable',
    family: 'Dravidian',
    script: 'Devanagari',
    isTribal: true,
    description: 'Spoken by the Oraon people across central and eastern India'
  },
  { 
    code: 'mjz', 
    name: 'Majhi', 
    nativeName: 'माझी', 
    region: 'Nepal/India', 
    country: 'Nepal', 
    speakers: 22000, 
    status: 'severely_endangered',
    family: 'Indo-European',
    isTribal: true,
    description: 'Spoken by the Majhi people along rivers in Nepal and India'
  },

  // African Indigenous Languages
  { 
    code: 'kho', 
    name: 'Khoikhoi', 
    nativeName: 'Khoekhoegowab', 
    region: 'Southern Africa', 
    country: 'Namibia', 
    speakers: 200000, 
    status: 'severely_endangered',
    family: 'Khoe-Kwadi',
    isTribal: true,
    description: 'Traditional language of the Khoi people with distinctive click consonants'
  },
  { 
    code: 'san', 
    name: 'San', 
    nativeName: '!Xóõ', 
    region: 'Kalahari', 
    country: 'Botswana', 
    speakers: 4200, 
    status: 'severely_endangered',
    family: 'Tuu',
    isTribal: true,
    description: 'Ancient hunter-gatherer language with complex click system'
  },
  { 
    code: 'had', 
    name: 'Hadza', 
    nativeName: 'Hadzane', 
    region: 'Tanzania', 
    country: 'Tanzania', 
    speakers: 1000, 
    status: 'critically_endangered',
    family: 'Language isolate',
    isTribal: true,
    description: 'Unique click language of the Hadza hunter-gatherers'
  },
  { 
    code: 'pig', 
    name: 'Pirahã', 
    nativeName: 'Pirahã', 
    region: 'Amazon', 
    country: 'Brazil', 
    speakers: 420, 
    status: 'critically_endangered',
    family: 'Mura',
    isTribal: true,
    description: 'Amazonian language famous for its unique grammatical properties'
  },

  // Native American Languages
  { 
    code: 'nav', 
    name: 'Navajo', 
    nativeName: 'Diné bizaad', 
    region: 'Southwest US', 
    country: 'United States', 
    speakers: 170000, 
    status: 'vulnerable',
    family: 'Na-Dené',
    isTribal: true,
    description: 'Most widely spoken Native American language in the US'
  },
  { 
    code: 'che', 
    name: 'Cherokee', 
    nativeName: 'ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ', 
    region: 'Southeast US', 
    country: 'United States', 
    speakers: 2000, 
    status: 'severely_endangered',
    family: 'Iroquoian',
    script: 'Cherokee syllabary',
    isTribal: true,
    description: 'Historic language with its own writing system'
  },
  { 
    code: 'lkt', 
    name: 'Lakota', 
    nativeName: 'Lakȟótiyapi', 
    region: 'Great Plains', 
    country: 'United States', 
    speakers: 2000, 
    status: 'severely_endangered',
    family: 'Siouan',
    isTribal: true,
    description: 'Language of the Lakota people of the Great Plains'
  },
  { 
    code: 'iku', 
    name: 'Inuktitut', 
    nativeName: 'ᐃᓄᒃᑎᑐᑦ', 
    region: 'Arctic Canada', 
    country: 'Canada', 
    speakers: 39000, 
    status: 'vulnerable',
    family: 'Eskimo-Aleut',
    script: 'Canadian Aboriginal syllabics',
    isTribal: true,
    description: 'Official language of Nunavut territory'
  },
  { 
    code: 'qu', 
    name: 'Quechua', 
    nativeName: 'Runa Simi', 
    region: 'Andes', 
    country: 'Peru', 
    speakers: 8000000, 
    status: 'vulnerable',
    family: 'Quechuan',
    isTribal: true,
    description: 'Ancient language of the Inca Empire, still widely spoken'
  },

  // Australian Aboriginal Languages
  { 
    code: 'wbp', 
    name: 'Warlpiri', 
    nativeName: 'Warlpiri', 
    region: 'Central Australia', 
    country: 'Australia', 
    speakers: 3000, 
    status: 'severely_endangered',
    family: 'Pama-Nyungan',
    isTribal: true,
    description: 'Well-documented Aboriginal language with unique grammar'
  },
  { 
    code: 'arb', 
    name: 'Arrernte', 
    nativeName: 'Arrernte', 
    region: 'Central Australia', 
    country: 'Australia', 
    speakers: 4500, 
    status: 'severely_endangered',
    family: 'Arandic',
    isTribal: true,
    description: 'Traditional language of the Alice Springs region'
  },
  { 
    code: 'yol', 
    name: 'Yolŋu Matha', 
    nativeName: 'Yolŋu Matha', 
    region: 'Northern Australia', 
    country: 'Australia', 
    speakers: 4000, 
    status: 'severely_endangered',
    family: 'Pama-Nyungan',
    isTribal: true,
    description: 'Language group of Arnhem Land Aboriginal peoples'
  },

  // Pacific Islander Languages
  { 
    code: 'rap', 
    name: 'Rapa Nui', 
    nativeName: 'Vananga Rapa Nui', 
    region: 'Easter Island', 
    country: 'Chile', 
    speakers: 5000, 
    status: 'severely_endangered',
    family: 'Polynesian',
    isTribal: true,
    description: 'Language of Easter Island with ancient Polynesian roots'
  },
  { 
    code: 'mao', 
    name: 'Māori', 
    nativeName: 'Te Reo Māori', 
    region: 'New Zealand', 
    country: 'New Zealand', 
    speakers: 185000, 
    status: 'vulnerable',
    family: 'Polynesian',
    isTribal: true,
    description: 'Official language of New Zealand, undergoing revitalization'
  },

  // Asian Indigenous Languages
  { 
    code: 'ain', 
    name: 'Ainu', 
    nativeName: 'アイヌ・イタㇰ', 
    region: 'Hokkaido', 
    country: 'Japan', 
    speakers: 10, 
    status: 'critically_endangered',
    family: 'Language isolate',
    isTribal: true,
    description: 'Indigenous language of northern Japan, nearly extinct'
  },
  { 
    code: 'hmn', 
    name: 'Hmong', 
    nativeName: 'Hmoob', 
    region: 'Southeast Asia', 
    country: 'China', 
    speakers: 4000000, 
    status: 'vulnerable',
    family: 'Hmong-Mien',
    isTribal: true,
    description: 'Language of the Hmong people across Southeast Asia'
  },
  { 
    code: 'kar', 
    name: 'Karen', 
    nativeName: 'ကညီကျိာ်', 
    region: 'Myanmar/Thailand', 
    country: 'Myanmar', 
    speakers: 1000000, 
    status: 'vulnerable',
    family: 'Sino-Tibetan',
    isTribal: true,
    description: 'Language group of the Karen people'
  },

  // European Indigenous Languages
  { 
    code: 'smi', 
    name: 'Sami', 
    nativeName: 'Sámegiella', 
    region: 'Lapland', 
    country: 'Norway', 
    speakers: 30000, 
    status: 'severely_endangered',
    family: 'Uralic',
    isTribal: true,
    description: 'Indigenous language of the Arctic Sami people'
  },
  { 
    code: 'eu', 
    name: 'Basque', 
    nativeName: 'Euskera', 
    region: 'Basque Country', 
    country: 'Spain', 
    speakers: 750000, 
    status: 'vulnerable',
    family: 'Language isolate',
    isTribal: true,
    description: 'Ancient pre-Indo-European language isolate'
  },
];

export const allLanguages = [...majorLanguages, ...tribalLanguages];

export const getLanguageByCode = (code: string): Language | undefined => {
  return allLanguages.find(lang => lang.code === code);
};

export const getTribalLanguages = (): Language[] => {
  return tribalLanguages;
};

export const getMajorLanguages = (): Language[] => {
  return majorLanguages;
};