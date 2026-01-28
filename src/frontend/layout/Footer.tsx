import React from 'react';
import { Trees, Heart, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Trees size={28} className="text-primary-300" />
              <span className="text-xl font-display font-semibold">TribalBridge</span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed mb-4">
              Preserving indigenous voices through advanced AI translation technology. 
              Connecting tribal communities with the modern world while honoring cultural heritage.
            </p>
            <div className="flex items-center space-x-1 text-primary-300 text-sm">
              <span>Made with</span>
              <Heart size={14} className="text-red-400" />
              <span>for cultural preservation</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/translate" className="text-primary-200 hover:text-white transition-colors">
                  Translator
                </Link>
              </li>
              <li>
                <Link to="/languages" className="text-primary-200 hover:text-white transition-colors">
                  Languages
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/api-docs" className="text-primary-200 hover:text-white transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/contribute" className="text-primary-200 hover:text-white transition-colors">
                  Contribute
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-primary-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary-200 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-primary-800" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-300">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex items-center space-x-1">
              <Globe size={14} />
              <span>Global Impact</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield size={14} />
              <span>Secure & Private</span>
            </div>
          </div>
          <div>
            <p>&copy; {currentYear} TribalBridge. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}