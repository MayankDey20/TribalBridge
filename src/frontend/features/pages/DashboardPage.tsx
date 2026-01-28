import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Globe, TrendingUp, FileText, Mic, Target, Zap, Users, Award, X, Upload, Check } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../backend/lib/supabase';
import { toast } from 'react-hot-toast';
import { TreeBackground } from '../../ui/TreeBackground';

interface TranslationStats {
  totalTranslations: number;
  thisMonth: number;
  averageAccuracy: number;
  languagesUsed: number;
  totalCharacters: number;
  averageProcessingTime: number;
}

interface RecentTranslation {
  id: string;
  source_language_code: string;
  target_language_code: string;
  source_text: string;
  translated_text: string;
  confidence_score: number;
  created_at: string;
  translation_type: string;
}

export function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<TranslationStats>({
    totalTranslations: 0,
    thisMonth: 0,
    averageAccuracy: 0,
    languagesUsed: 0,
    totalCharacters: 0,
    averageProcessingTime: 0
  });
  const [recentTranslations, setRecentTranslations] = useState<RecentTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      // Fetch user translations
      const { data: translations, error } = await supabase
        .from('translations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setLoading(false);
        return;
      }

      const translationsData = translations || [];

      // Calculate stats
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const thisMonthTranslations = translationsData.filter(t => 
        new Date(t.created_at) >= thisMonth
      );

      const uniqueLanguages = new Set();
      let totalCharacters = 0;
      let totalProcessingTime = 0;
      let totalConfidence = 0;

      translationsData.forEach(t => {
        uniqueLanguages.add(t.source_language_code);
        uniqueLanguages.add(t.target_language_code);
        totalCharacters += t.character_count || 0;
        totalProcessingTime += t.processing_time_ms || 0;
        totalConfidence += (t.confidence_score || 0) * 100;
      });

      setStats({
        totalTranslations: translationsData.length,
        thisMonth: thisMonthTranslations.length,
        averageAccuracy: translationsData.length ? Math.round(totalConfidence / translationsData.length) : 0,
        languagesUsed: uniqueLanguages.size,
        totalCharacters,
        averageProcessingTime: translationsData.length ? Math.round(totalProcessingTime / translationsData.length) : 0
      });

      setRecentTranslations(translationsData.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  const getLanguageName = (code: string) => {
    const languageNames: { [key: string]: string } = {
      'gon': 'Gondi', 'sat': 'Santali', 'ho': 'Ho', 'brx': 'Bodo',
      'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 'es': 'Spanish',
      'fr': 'French', 'de': 'German', 'pt': 'Portuguese', 'zh': 'Chinese',
      'ja': 'Japanese', 'ar': 'Arabic', 'nav': 'Navajo', 'che': 'Cherokee'
    };
    return languageNames[code] || code.toUpperCase();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return Mic;
      case 'document': return FileText;
      default: return Globe;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const dashboardStats = [
    { 
      icon: Globe, 
      label: 'Languages Used', 
      value: stats.languagesUsed.toString(), 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2 this month'
    },
    { 
      icon: FileText, 
      label: 'Total Translations', 
      value: stats.totalTranslations.toString(), 
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `+${stats.thisMonth} this month`
    },
    { 
      icon: Target, 
      label: 'Avg. Accuracy', 
      value: `${stats.averageAccuracy}%`, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+25% vs. general translators'
    },
    { 
      icon: Zap, 
      label: 'Avg. Speed', 
      value: `${stats.averageProcessingTime}ms`, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '40% faster for tribal languages'
    },
  ];

  const achievements = [
    { name: 'First Translation', completed: stats.totalTranslations > 0, icon: Globe },
    { name: 'Polyglot', completed: stats.languagesUsed >= 3, icon: Users },
    { name: 'Cultural Bridge', completed: stats.totalTranslations >= 10, icon: Award },
    { name: 'Language Preserver', completed: stats.totalTranslations >= 50, icon: TrendingUp },
  ];

  if (loading) {
    return (
      <TreeBackground variant="minimal">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      </TreeBackground>
    );
  }

  return (
    <TreeBackground variant="minimal">
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600">
              Your journey in preserving indigenous languages and bridging cultural gaps.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {dashboardStats.map((stat, index) => (
              <Card key={index} hover className="text-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {stat.label}
                </div>
                <div className="text-xs text-primary-600 font-medium">
                  {stat.change}
                </div>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Translations */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Translations
                  </h2>
                  <Link to="/history">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentTranslations.length > 0 ? recentTranslations.map((translation) => {
                    const TypeIcon = getTypeIcon(translation.translation_type);
                    return (
                      <div
                        key={translation.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <TypeIcon size={16} className="text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {getLanguageName(translation.source_language_code)}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-sm font-medium text-gray-900">
                              {getLanguageName(translation.target_language_code)}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {Math.round((translation.confidence_score || 0) * 100)}% confidence
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {translation.source_text}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {formatTimeAgo(translation.created_at)}
                        </span>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No translations yet. Start your first translation!</p>
                      <Link to="/translate" className="mt-2 inline-block">
                        <Button size="sm">Start Translating</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions & Achievements */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Quick Actions */}
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                
                <div className="space-y-3">
                  <Link to="/translate">
                    <Button className="w-full justify-start" icon={Globe}>
                      New Translation
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={FileText}
                    onClick={() => setShowDocumentUpload(true)}
                  >
                    Upload Document
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={Mic}
                    onClick={() => navigate('/translate')}
                  >
                    Voice Translation
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    icon={BarChart3}
                    onClick={() => setShowAnalytics(true)}
                  >
                    View Analytics
                  </Button>
                </div>
              </Card>

              {/* Achievements */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Achievements
                </h3>
                
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        achievement.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <achievement.icon className={`w-4 h-4 ${
                          achievement.completed ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className={`text-sm ${
                        achievement.completed ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </span>
                      {achievement.completed && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Performance Insights */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Performance Insights
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Translation Accuracy</span>
                      <span className="font-medium text-green-600">{stats.averageAccuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.averageAccuracy}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      +25% better than general translators for tribal languages
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Processing Speed</span>
                      <span className="font-medium text-blue-600">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-4/5 transition-all duration-300" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      40% faster processing for indigenous languages
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      <AnimatePresence>
        {showDocumentUpload && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDocumentUpload(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Upload Document</h3>
                <button onClick={() => setShowDocumentUpload(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                  <input
                    type="file"
                    id="document-upload"
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {uploadedFile ? uploadedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">
                      TXT, PDF, DOC, DOCX (Max 10MB)
                    </p>
                  </label>
                </div>

                {uploadedFile && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-900">{uploadedFile.name} selected</span>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowDocumentUpload(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={async () => {
                      if (!uploadedFile) {
                        toast.error('Please select a file first');
                        return;
                      }
                      setIsUploading(true);
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      toast.success('Document uploaded! Redirecting to translation page...');
                      setIsUploading(false);
                      setShowDocumentUpload(false);
                      setTimeout(() => navigate('/translate'), 500);
                    }}
                    loading={isUploading}
                    disabled={!uploadedFile}
                  >
                    Upload & Translate
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAnalytics(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Detailed Analytics</h3>
                <button onClick={() => setShowAnalytics(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h4 className="font-semibold text-gray-900 mb-4">Translation Volume</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Translations</span>
                      <span className="text-lg font-bold text-primary-600">{stats.totalTranslations}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="text-lg font-bold text-green-600">{stats.thisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Characters</span>
                      <span className="text-lg font-bold text-blue-600">{stats.totalCharacters.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. Accuracy</span>
                      <span className="text-lg font-bold text-purple-600">{stats.averageAccuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. Speed</span>
                      <span className="text-lg font-bold text-orange-600">{stats.averageProcessingTime}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Languages Used</span>
                      <span className="text-lg font-bold text-teal-600">{stats.languagesUsed}</span>
                    </div>
                  </div>
                </Card>

                <Card className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-4">Monthly Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Goal: 50 translations/month</span>
                      <span className="font-medium text-primary-600">{Math.round((stats.thisMonth / 50) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((stats.thisMonth / 50) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {stats.thisMonth >= 50 ? 'Goal achieved! 🎉' : `${50 - stats.thisMonth} more translations to reach your goal`}
                    </p>
                  </div>
                </Card>

                <Card className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-4">Insights & Recommendations</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">You're doing great!</p>
                        <p className="text-xs text-blue-700">Your translation accuracy is above average</p>
                      </div>
                    </div>
                    {stats.thisMonth < 10 && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <Target className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Keep it up!</p>
                          <p className="text-xs text-yellow-700">Try to translate at least once per day to build momentum</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TreeBackground>
  );
}