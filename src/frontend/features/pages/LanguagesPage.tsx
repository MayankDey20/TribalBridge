import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Globe, Users, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { tribalLanguages, majorLanguages, Language } from '../../../backend/languages';
import { TreeBackground } from '../../ui/TreeBackground';

export function LanguagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tribal' | 'major' | 'endangered'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const allLanguages = [...tribalLanguages, ...majorLanguages];
  const regions = Array.from(new Set(allLanguages.map(lang => lang.region))).sort();

  const filteredLanguages = allLanguages.filter(language => {
    const matchesSearch = language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         language.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'tribal' && language.isTribal) ||
                         (selectedFilter === 'major' && !language.isTribal) ||
                         (selectedFilter === 'endangered' && language.status !== 'safe');
    
    const matchesRegion = selectedRegion === 'all' || language.region === selectedRegion;
    
    return matchesSearch && matchesFilter && matchesRegion;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critically_endangered': return 'text-red-600 bg-red-100 border-red-200';
      case 'severely_endangered': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'definitely_endangered': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'vulnerable': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-green-600 bg-green-100 border-green-200';
    }
  };

  const formatSpeakers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const getUrgencyLevel = (status: string) => {
    switch (status) {
      case 'critically_endangered': return 'Critical';
      case 'severely_endangered': return 'Severe';
      case 'definitely_endangered': return 'High';
      case 'vulnerable': return 'Medium';
      default: return 'Stable';
    }
  };

  return (
    <TreeBackground variant="minimal">
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
              World Languages Database
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive collection of indigenous and major world languages, 
              each with detailed information about speakers, regions, and preservation status.
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {allLanguages.length}
              </div>
              <div className="text-sm text-gray-600">Total Languages</div>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {tribalLanguages.length}
              </div>
              <div className="text-sm text-gray-600">Indigenous Languages</div>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {tribalLanguages.filter(l => l.status !== 'safe').length}
              </div>
              <div className="text-sm text-gray-600">Endangered</div>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {regions.length}
              </div>
              <div className="text-sm text-gray-600">Regions Covered</div>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Input
                    placeholder="Search languages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={Search}
                  />
                </div>
                
                <div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                  >
                    <option value="all">All Languages</option>
                    <option value="tribal">Indigenous & Tribal</option>
                    <option value="major">Major World Languages</option>
                    <option value="endangered">Endangered Languages</option>
                  </select>
                </div>
                
                <div>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                  >
                    <option value="all">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Languages Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredLanguages.map((language, index) => (
              <motion.div
                key={language.code}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {language.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{language.nativeName}</p>
                    </div>
                    {language.isTribal && (
                      <div className="flex items-center space-x-1">
                        {(language.status === 'critically_endangered' || language.status === 'severely_endangered') && (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(language.status)}`}>
                          {getUrgencyLevel(language.status)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Region:</span>
                      <span className="font-medium text-gray-900">{language.region}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Speakers:</span>
                      <span className="font-medium text-gray-900">
                        {formatSpeakers(language.speakers)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Family:</span>
                      <span className="font-medium text-gray-900">{language.family}</span>
                    </div>

                    {language.script && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Script:</span>
                        <span className="font-medium text-gray-900">{language.script}</span>
                      </div>
                    )}
                  </div>

                  {language.description && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {language.description}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        // Navigate to translate page with this language pre-selected
                        window.location.href = `/translate?lang=${language.code}`;
                      }}
                    >
                      Translate with {language.name}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredLanguages.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No languages found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-primary-50 to-earth-50 border-primary-200">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
                Help Preserve These Languages
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Every translation helps preserve cultural heritage and keeps these languages alive. 
                Join our community of language preservers and make a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" icon={TrendingUp}>
                  Start Translating
                </Button>
                <Button variant="outline" size="lg">
                  Contribute Data
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </TreeBackground>
  );
}