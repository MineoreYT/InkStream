import { useState } from 'react';
import { AlertTriangle, X, FileText, Shield } from 'lucide-react';

const LegalNotice = () => {
  const [isVisible, setIsVisible] = useState(() => {
    return !localStorage.getItem('legal_notice_accepted');
  });

  const acceptNotice = () => {
    localStorage.setItem('legal_notice_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-red-500" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Legal Notice</h2>
              <p className="text-gray-600">Educational Use Only</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <Shield size={16} />
                Copyright Disclaimer
              </h3>
              <p className="text-red-700 text-sm">
                This application is for <strong>educational and demonstration purposes only</strong>. 
                All manga/manhwa content belongs to their respective copyright holders. 
                We do not claim ownership of any displayed content.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Educational Purpose</h3>
              <p className="text-blue-700 text-sm">
                This app demonstrates modern web development techniques including React, PWA, 
                and mobile app development. It is not intended for commercial use.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">User Responsibility</h3>
              <p className="text-yellow-700 text-sm">
                By using this application, you acknowledge that you are responsible for 
                complying with local copyright laws and using this for educational purposes only.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Data Source</h3>
              <p className="text-gray-700 text-sm">
                Content is sourced from the public MangaDx API. We do not host or distribute 
                copyrighted content directly. All requests are proxied through official APIs.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-4 mb-6 text-sm">
            <a 
              href="/LEGAL.md" 
              target="_blank" 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <FileText size={14} />
              Full Legal Information
            </a>
            <a 
              href="/TERMS.md" 
              target="_blank" 
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <FileText size={14} />
              Terms of Service
            </a>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={acceptNotice}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              I Understand - Continue for Educational Use
            </button>
            <button
              onClick={() => window.close()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Exit
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            This notice will not appear again once accepted. You can review legal information anytime in the footer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;