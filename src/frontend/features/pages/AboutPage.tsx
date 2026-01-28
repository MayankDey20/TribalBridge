import React from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Globe, Target, Lightbulb, TrendingUp, Users, Award } from 'lucide-react';
import { Card } from '../../ui/Card';
import { TreeBackground } from '../../ui/TreeBackground';

export function AboutPage() {
  const achievements = [
    { icon: Globe, title: '35+ Languages', description: 'Supporting endangered languages worldwide' },
    { icon: Users, title: 'Growing Community', description: 'Language preservers and contributors' },
    { icon: TrendingUp, title: '95% Accuracy', description: 'Superior translation quality' },
    { icon: Award, title: 'Technical Excellence', description: 'Advanced AI models for tribal languages' },
  ];

  const mission = [
    {
      icon: Heart,
      title: 'Preserve Heritage',
      description: 'Every language carries centuries of wisdom, stories, and cultural identity that deserves to be preserved for future generations.'
    },
    {
      icon: Users,
      title: 'Empower Communities',
      description: 'Enable indigenous communities to participate in global conversations while maintaining their linguistic identity.'
    },
    {
      icon: Globe,
      title: 'Bridge Worlds',
      description: 'Connect traditional knowledge with modern technology, creating pathways for cultural exchange and understanding.'
    },
    {
      icon: Target,
      title: 'Drive Impact',
      description: 'Support researchers, educators, and NGOs working to document and revitalize endangered languages.'
    }
  ];

  return (
    <TreeBackground variant="subtle" showLeaves>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                About TribalBridge
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Preserving the world's endangered languages through innovative AI technology
              </p>
            </motion.div>

            {/* Achievements Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <achievement.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {achievement.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {achievement.description}
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Creator Section */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">Meet the Creator</h2>
                    <p className="text-primary-600 font-medium">Mayank Dey</p>
                  </div>
                </div>
                
                <div className="prose prose-lg text-gray-600 space-y-4">
                  <p>
                    Hi, I'm Mayank Dey, a Computer Science Engineering student with a deep passion for 
                    cybersecurity, AI, and building technology that creates meaningful impact.
                  </p>
                  
                  <p>
                    The idea for TribalBridge wasn't conceived in a corporate boardroom. It emerged from 
                    a profound realization during my academic journey. While working on various tech projects, 
                    I noticed a glaring gap: countless tribal and indigenous languages worldwide are 
                    disappearing, not because they lack meaning or beauty, but because they lack 
                    accessibility in our digital age.
                  </p>
                  
                  <p>
                    This observation struck a deep chord with me. These languages represent millennia of 
                    human wisdom, cultural identity, and unique ways of understanding the world. Yet they 
                    remain underrepresented in technology, education, and global communication systems.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-primary-50 to-earth-50 border-primary-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">The Vision</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    "I built TribalBridge to bridge this critical gap. Creating a tool that does more 
                    than just translate words. It preserves identity, celebrates linguistic diversity, 
                    and empowers communities to maintain their cultural heritage while participating 
                    in the global conversation."
                  </p>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 italic">
                      "This app represents my commitment to showing that technology can serve humanity, 
                      especially the voices that often go unheard."
                    </p>
                    <p className="text-sm text-primary-700 font-medium mt-2">— Mayank Dey</p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <TreeBackground variant="prominent">
          <section className="py-16 bg-gradient-to-br from-primary-900/95 to-primary-800/95 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Our Mission & Impact
                </h2>
                <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                  TribalBridge serves researchers, educators, NGOs, and most importantly, 
                  native speakers who deserve to be heard in their own tongue.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {mission.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                      </div>
                      <p className="text-primary-100 leading-relaxed">
                        {item.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </TreeBackground>

        {/* Technology & Innovation */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                Advanced AI Technology
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Built from the ground up with cutting-edge AI models specifically trained 
                for endangered and indigenous languages
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card hover className="text-center h-full">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">95% Accuracy Rate</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our specialized AI models achieve 95% accuracy for tribal languages, 
                    significantly outperforming general-purpose translators that typically 
                    achieve 60-70% accuracy for endangered languages.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">Cultural Context</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Unlike generic translators, our AI understands cultural nuances, 
                    traditional expressions, and ceremonial language patterns, 
                    preserving the authentic meaning and context.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card hover className="text-center h-full">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">Community Trained</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our models are trained with input from native speakers and 
                    linguistic experts, ensuring authentic representation and 
                    continuous improvement through community feedback.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Future Vision */}
        <section className="py-16 bg-gradient-to-br from-earth-50 to-primary-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Looking Ahead
              </h2>
              <div className="prose prose-lg text-gray-600 mx-auto space-y-4">
                <p>
                  TribalBridge is more than a project. It's a living, evolving commitment to 
                  linguistic diversity. We're continuously expanding our language support, 
                  inviting native speakers to contribute, and improving our AI accuracy through 
                  community collaboration.
                </p>
                
                <p>
                  Our roadmap includes offline capabilities for remote communities, 
                  educational partnerships with schools and universities, and advanced 
                  features like dialect recognition and ceremonial language preservation.
                </p>
                
                <p className="text-primary-700 font-medium text-xl">
                  Together, we're ensuring that no language and no voice is left behind 
                  in our interconnected world.
                </p>
              </div>
              
              <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-600 italic mb-2">
                  "Thank you for being part of this journey to preserve humanity's linguistic heritage."
                </p>
                <p className="text-primary-700 font-semibold">— Mayank Dey, Founder & Creator</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </TreeBackground>
  );
}