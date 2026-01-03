import { FileText, Shield, AlertTriangle, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Legal Information */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield size={20} />
              Legal Information
            </h3>
            <div className="space-y-2 text-sm">
              <a
                href="/legal"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FileText size={14} />
                Copyright Disclaimer
              </a>
              <a
                href="/terms"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FileText size={14} />
                Terms of Service
              </a>
              <a
                href="/privacy"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FileText size={14} />
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Educational Purpose */}
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <AlertTriangle size={20} />
              Educational Use Only
            </h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>This app is for educational and demonstration purposes only.</p>
              <p>All content belongs to respective copyright holders.</p>
              <p>Not intended for commercial use.</p>
            </div>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="font-bold text-lg mb-4">Data Sources</h3>
            <div className="space-y-2 text-sm">
              <a
                href="https://mangadx.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ExternalLink size={14} />
                MangaDx API
              </a>
              <p className="text-gray-400">
                Content sourced through official public APIs
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2024 InkStream - Educational Demonstration Project
            </div>
            <div className="text-xs text-gray-500">
              No copyright infringement intended • Educational use only • Not for commercial purposes
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;