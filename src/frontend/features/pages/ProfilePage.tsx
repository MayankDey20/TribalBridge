import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Globe, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Award, 
  TrendingUp, 
  Languages, 
  Clock,
  MapPin,
  Shield,
  Settings,
  Bell,
  Lock,
  Trash2
} from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../../backend/lib/supabase';
import { TreeBackground } from '../../ui/TreeBackground';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  bio: string;
  preferred_language: string;
  profile_image_url: string;
  translation_count: number;
  contribution_score: number;
  languages_contributed_to: string[];
  total_characters_translated: number;
  average_translation_accuracy: number;
  cultural_preservation_score: number;
  last_translation_date: string;
  created_at: string;
  role: 'admin' | 'contributor' | 'user';
}

interface ProfileStats {
  totalTranslations: number;
  averageAccuracy: number;
  languagesUsed: number;
  totalCharacters: number;
  contributionScore: number;
  culturalScore: number;
  joinedDaysAgo: number;
  currentStreak: number;
}

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'privacy'>('overview');
  
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    preferred_language: 'en'
  });

  const [notifications, setNotifications] = useState({
    translation_updates: true,
    language_additions: true,
    community_updates: false,
    marketing_emails: false
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      if (!profileData) {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          bio: '',
          preferred_language: 'en',
          profile_image_url: '',
          translation_count: 0,
          contribution_score: 0,
          languages_contributed_to: [],
          total_characters_translated: 0,
          average_translation_accuracy: 0,
          cultural_preservation_score: 0,
          last_translation_date: null,
          role: 'user' as const
        };

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }

        setProfile(insertedProfile);
        setEditForm({
          full_name: insertedProfile.full_name || '',
          bio: insertedProfile.bio || '',
          preferred_language: insertedProfile.preferred_language || 'en'
        });
      } else {
        setProfile(profileData);
        setEditForm({
          full_name: profileData.full_name || '',
          bio: profileData.bio || '',
          preferred_language: profileData.preferred_language || 'en'
        });
      }

      // Calculate stats
      const finalProfile = profileData || {
        created_at: new Date().toISOString(),
        translation_count: 0,
        average_translation_accuracy: 0,
        languages_contributed_to: [],
        total_characters_translated: 0,
        contribution_score: 0,
        cultural_preservation_score: 0
      };

      const joinedDate = new Date(finalProfile.created_at);
      const now = new Date();
      const joinedDaysAgo = Math.floor((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));

      // Fetch recent translations for streak calculation
      const { data: recentTranslations } = await supabase
        .from('translations')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      // Calculate current streak
      let currentStreak = 0;
      if (recentTranslations && recentTranslations.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < recentTranslations.length; i++) {
          const translationDate = new Date(recentTranslations[i].created_at);
          translationDate.setHours(0, 0, 0, 0);
          
          const daysDiff = Math.floor((today.getTime() - translationDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === currentStreak) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      setStats({
        totalTranslations: finalProfile.translation_count || 0,
        averageAccuracy: Math.round((finalProfile.average_translation_accuracy || 0) * 100),
        languagesUsed: finalProfile.languages_contributed_to?.length || 0,
        totalCharacters: finalProfile.total_characters_translated || 0,
        contributionScore: finalProfile.contribution_score || 0,
        culturalScore: finalProfile.cultural_preservation_score || 0,
        joinedDaysAgo,
        currentStreak
      });

    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      toast.error(`Failed to load profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          bio: editForm.bio,
          preferred_language: editForm.preferred_language,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        toast.error('Account deletion requires admin approval. Please contact support.');
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const handleDataExport = async () => {
    try {
      if (!user) return;

      toast.loading('Preparing your data export...');
      
      const { data: translations, error } = await supabase
        .from('translations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const exportData = {
        profile: {
          email: profile?.email,
          full_name: profile?.full_name,
          bio: profile?.bio,
          translation_count: profile?.translation_count,
          contribution_score: profile?.contribution_score,
          joined_date: profile?.created_at
        },
        translations: translations?.map(t => ({
          source_language: t.source_language_code,
          target_language: t.target_language_code,
          source_text: t.source_text,
          translated_text: t.translated_text,
          confidence: t.confidence_score,
          date: t.created_at
        })),
        export_date: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tribalbridge-data-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success('Your data has been exported successfully!');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export data. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.new || !passwordForm.confirm) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new
      });

      if (error) throw error;

      toast.success('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'contributor': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLanguageName = (code: string) => {
    const languages: { [key: string]: string } = {
      'en': 'English',
      'hi': 'Hindi',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'pt': 'Portuguese',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ar': 'Arabic'
    };
    return languages[code] || code.toUpperCase();
  };

  if (loading) {
    return (
      <TreeBackground variant="minimal">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      </TreeBackground>
    );
  }

  if (!profile || !stats) {
    return (
      <TreeBackground variant="minimal">
        <div className="min-h-screen flex items-center justify-center">
          <Card className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600">Unable to load your profile data.</p>
            <Button 
              onClick={fetchProfile} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </Card>
        </div>
      </TreeBackground>
    );
  }

  return (
    <TreeBackground variant="minimal">
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account, preferences, and view your language preservation journey.
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', icon: User },
                  { id: 'settings', name: 'Settings', icon: Settings },
                  { id: 'privacy', name: 'Privacy', icon: Shield }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <motion.div
                className="lg:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                        {profile.profile_image_url ? (
                          <img
                            src={profile.profile_image_url}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-primary-600" />
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50">
                        <Camera size={14} className="text-gray-600" />
                      </button>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {profile.full_name || 'Anonymous User'}
                    </h2>
                    
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{profile.email}</span>
                    </div>

                    <div className="flex justify-center mb-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(profile.role)}`}>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      </span>
                    </div>

                    {profile.bio && (
                      <p className="text-sm text-gray-600 mb-4 text-center">
                        {profile.bio}
                      </p>
                    )}

                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>Joined {stats.joinedDaysAgo} days ago</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      icon={Edit3}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Streak</span>
                      <span className="font-medium text-orange-600">{stats.currentStreak} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Contribution Score</span>
                      <span className="font-medium text-primary-600">{formatNumber(stats.contributionScore)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cultural Impact</span>
                      <span className="font-medium text-purple-600">{stats.culturalScore}%</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Stats and Activity */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Performance Stats */}
                <Card>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Translation Performance
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Globe className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.totalTranslations}
                      </div>
                      <div className="text-sm text-gray-600">Total Translations</div>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.averageAccuracy}%
                      </div>
                      <div className="text-sm text-gray-600">Avg. Accuracy</div>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Languages className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stats.languagesUsed}
                      </div>
                      <div className="text-sm text-gray-600">Languages Used</div>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Award className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {formatNumber(stats.totalCharacters)}
                      </div>
                      <div className="text-sm text-gray-600">Characters Translated</div>
                    </div>
                  </div>
                </Card>

                {/* Languages Contributed */}
                <Card>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Languages You've Worked With
                  </h3>
                  
                  {profile.languages_contributed_to && profile.languages_contributed_to.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.languages_contributed_to.map((langCode, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                        >
                          {getLanguageName(langCode)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Start translating to see your language contributions here!
                    </p>
                  )}
                </Card>

                {/* Recent Activity */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Recent Activity
                    </h3>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-3">
                    {profile.last_translation_date ? (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Globe size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Last Translation</p>
                          <p className="text-xs text-gray-500">
                            {new Date(profile.last_translation_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No recent activity. Start translating to see your activity here!
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Account Settings
                </h3>

                <div className="space-y-6">
                  <div>
                    <Input
                      label="Full Name"
                      value={isEditing ? editForm.full_name : profile.full_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Input
                      label="Email Address"
                      value={profile.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={isEditing ? editForm.bio : profile.bio || ''}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none disabled:bg-gray-50"
                      placeholder="Tell us about yourself and your interest in language preservation..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <select
                      value={isEditing ? editForm.preferred_language : profile.preferred_language}
                      onChange={(e) => setEditForm({ ...editForm, preferred_language: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none disabled:bg-gray-50"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    {isEditing ? (
                      <div className="flex space-x-3">
                        <Button
                          onClick={handleSaveProfile}
                          loading={saving}
                          icon={Save}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm({
                              full_name: profile.full_name || '',
                              bio: profile.bio || '',
                              preferred_language: profile.preferred_language || 'en'
                            });
                          }}
                          icon={X}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        icon={Edit3}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Notification Settings */}
              <Card className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {key === 'translation_updates' && 'Get notified about translation improvements and new features'}
                          {key === 'language_additions' && 'Be the first to know when new languages are added'}
                          {key === 'community_updates' && 'Receive updates about community contributions and events'}
                          {key === 'marketing_emails' && 'Receive promotional emails and newsletters'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !value })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Privacy & Security
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Change
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShow2FAModal(true)}
                    >
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Data Export</h4>
                        <p className="text-sm text-gray-600">Download your translation data</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDataExport}
                    >
                      Export
                    </Button>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        <div>
                          <h4 className="font-medium text-red-900">Delete Account</h4>
                          <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        onClick={handleDeleteAccount}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={signOut}
                      className="text-gray-700"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Edit Profile Modal */}
          {isEditing && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <select
                      value={editForm.preferred_language}
                      onChange={(e) => setEditForm({ ...editForm, preferred_language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    loading={saving}
                    icon={Save}
                  >
                    Save Changes
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Password Change Modal */}
          <AnimatePresence>
            {showPasswordModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPasswordModal(false)}
              >
                <motion.div
                  className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
                    <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="New Password"
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      placeholder="Enter new password"
                    />

                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      placeholder="Confirm new password"
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-900">
                        <strong>Password requirements:</strong> At least 6 characters
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handlePasswordChange} loading={changingPassword}>
                      Change Password
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2FA Setup Modal */}
          <AnimatePresence>
            {show2FAModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShow2FAModal(false)}
              >
                <motion.div
                  className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Enable Two-Factor Authentication</h3>
                    <button onClick={() => setShow2FAModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg p-4 text-center">
                      <Shield className="w-16 h-16 mx-auto mb-3 text-primary-600" />
                      <p className="text-sm text-gray-700 mb-2">
                        Two-factor authentication adds an extra layer of security to your account
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          1
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Download an authenticator app</p>
                          <p className="text-xs text-gray-600">Google Authenticator, Authy, or Microsoft Authenticator</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          2
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Scan QR code</p>
                          <p className="text-xs text-gray-600">Use your app to scan the QR code we'll provide</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          3
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Enter verification code</p>
                          <p className="text-xs text-gray-600">Confirm setup with the 6-digit code</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setShow2FAModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      toast.success('2FA setup will be available in the next update!');
                      setShow2FAModal(false);
                    }}>
                      Continue
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TreeBackground>
  );
}