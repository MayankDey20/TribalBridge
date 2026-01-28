import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Globe, Shield, Zap, Heart, Award, Check, X, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { TreeBackground } from '../../ui/TreeBackground';

export function HomePage() {
  const features = [
    {
      icon: Globe,
      title: 'Preserve Heritage',
      description: 'Keep tribal languages alive through advanced AI translation technology'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your translations are encrypted and never stored without permission'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get accurate translations in seconds with our optimized AI models'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built with input from tribal communities and language experts'
    }
  ];

  const stats = [
    { value: '35+', label: 'Languages' },
    { value: '95%', label: 'Accuracy' },
    { value: '40%', label: 'Faster' },
    { value: '24/7', label: 'Available' },
  ];

  return (
    <TreeBackground variant="subtle" showLeaves>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <motion.h1
                className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Preserving{' '}
                <span className="text-primary-600 relative">
                  Indigenous Voices
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-primary-300"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Bridge the gap between tribal languages and the modern world with our AI-powered translation platform. 
                Honor cultural heritage while enabling seamless communication.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link to="/translate">
                  <Button size="lg" icon={ArrowRight} iconPosition="right">
                    Start Translating
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Why Choose TribalBridge?
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Built with respect for indigenous cultures and powered by cutting-edge AI technology
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover className="text-center h-full">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-earth-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2
                className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Why TribalBridge Outperforms Traditional Translators
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Built specifically for indigenous languages with superior accuracy, speed, and cultural preservation
              </motion.p>
            </div>

            {/* Stats Highlights */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Accuracy with Tribal Languages</div>
                <div className="text-xs text-gray-600">vs 65-75% with traditional translators</div>
              </Card>

              <Card className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">50%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Faster Translation Speed</div>
                <div className="text-xs text-gray-600">Average 1.8s vs 3-5s with others</div>
              </Card>

              <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Free for All Users</div>
                <div className="text-xs text-gray-600">No premium tiers or hidden costs</div>
              </Card>
            </motion.div>

            {/* Comparison Table */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
                <div className="font-semibold text-sm md:text-base">Feature</div>
                <div className="font-semibold text-sm md:text-base text-center">TribalBridge</div>
                <div className="font-semibold text-sm md:text-base text-center">Traditional Translators</div>
              </div>

              {[
                { feature: 'Tribal Language Support', tribal: '15+ Languages', traditional: '0-2 Languages', tribalWins: true },
                { feature: 'Cultural Context Preservation', tribal: 'High Accuracy', traditional: 'Low/None', tribalWins: true },
                { feature: 'Offline Translation', tribal: 'Available', traditional: 'Not Available', tribalWins: true },
                { feature: 'Community Contributions', tribal: 'Yes', traditional: 'No', tribalWins: true },
                { feature: 'Audio Translation', tribal: 'Full Support', traditional: 'Limited', tribalWins: true },
                { feature: 'Document Translation', tribal: 'Free', traditional: 'Paid Only', tribalWins: true },
                { feature: 'Translation Speed', tribal: 'Fast (<2s)', traditional: 'Slow (3-5s)', tribalWins: true },
                { feature: 'Cost', tribal: 'Free', traditional: 'Paid/Limited', tribalWins: true },
              ].map((row, index) => (
                <motion.div
                  key={index}
                  className={`grid grid-cols-3 p-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <div className="text-sm md:text-base text-gray-900 font-medium flex items-center">
                    {row.feature}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      <Check className="w-4 h-4" />
                      <span className="text-xs md:text-sm font-medium">{row.tribal}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full">
                      <X className="w-4 h-4" />
                      <span className="text-xs md:text-sm">{row.traditional}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-lg text-gray-700 mb-6">
                Experience the difference. Start translating with TribalBridge today.
              </p>
              <Link to="/translate">
                <Button size="lg" icon={ArrowRight} iconPosition="right">
                  Try It Now - It's Free
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <TreeBackground variant="prominent">
          <section className="py-20 bg-gradient-to-r from-primary-900/95 to-primary-800/95 text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Heart className="w-6 h-6 text-red-400" />
                    <span className="text-primary-200">Our Mission</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                    Every Language Tells a Story Worth Preserving
                  </h2>
                  <p className="text-lg text-primary-100 leading-relaxed mb-6">
                    Indigenous languages carry millennia of wisdom, culture, and identity. 
                    TribalBridge ensures these precious voices continue to be heard in our interconnected world.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-primary-300" />
                    <span className="text-primary-200">Advanced AI Technology</span>
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <h4 className="font-semibold mb-2">Cultural Preservation</h4>
                    <p className="text-sm text-primary-100">
                      Maintain the essence and nuance of tribal languages
                    </p>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <h4 className="font-semibold mb-2">Community Empowerment</h4>
                    <p className="text-sm text-primary-100">
                      Enable tribal communities to participate in global conversations
                    </p>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <h4 className="font-semibold mb-2">Educational Access</h4>
                    <p className="text-sm text-primary-100">
                      Break down language barriers in education and healthcare
                    </p>
                  </Card>
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <h4 className="font-semibold mb-2">Digital Inclusion</h4>
                    <p className="text-sm text-primary-100">
                      Bring tribal languages into the digital age
                    </p>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
        </TreeBackground>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-earth-50 to-primary-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Ready to Bridge Languages?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join our community of language preservers helping to maintain indigenous languages 
                while enabling modern communication.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=signup">
                  <Button size="lg" icon={ArrowRight} iconPosition="right">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/translate">
                  <Button variant="outline" size="lg">
                    Try Translation
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </TreeBackground>
  );
}