import React from 'react';
import { motion } from 'framer-motion';
import { TranslationInterface } from './TranslationInterface';
import { Upload, FileText, Headphones } from 'lucide-react';
import { Card } from '../../ui/Card';
import { TreeBackground } from '../../ui/TreeBackground';

export function TranslatePage() {
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
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              AI-Powered Language Translation
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Translate between tribal languages and major world languages with advanced AI technology
            </p>
          </motion.div>

          {/* Translation Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TranslationInterface />
          </motion.div>

          {/* Additional Features */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card hover className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Document Translation
              </h3>
              <p className="text-gray-600 text-sm">
                Upload PDF, DOCX, or TXT files for bulk translation while preserving formatting
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Voice Translation
              </h3>
              <p className="text-gray-600 text-sm">
                Speak in any supported language and get real-time audio translation
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Translation History
              </h3>
              <p className="text-gray-600 text-sm">
                Access your previous translations and build your personal language library
              </p>
            </Card>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            className="mt-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              Translation Tips for Best Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Text Input</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Use clear, simple sentences for better accuracy</li>
                  <li>• Avoid slang or highly colloquial expressions</li>
                  <li>• Include context when translating cultural terms</li>
                  <li>• Check spelling in the source language</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Voice Input</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Use a quiet environment to reduce background noise</li>
                  <li>• Pause between sentences for better recognition</li>
                  <li>• Ensure your microphone has proper permissions</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </TreeBackground>
  );
}