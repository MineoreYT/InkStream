import { Shield, Lock, Database, Eye, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const PrivacyPolicyPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg p-8 mb-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <Shield size={40} />
                    <h1 className="text-4xl font-bold">Privacy Policy</h1>
                </div>
                <p className="text-lg opacity-90">
                    Your privacy matters to us. Learn how we handle your data.
                </p>
                <p className="text-sm mt-2 opacity-75">
                    Effective Date: January 2026 | Last Updated: January 3, 2026
                </p>
            </div>

            {/* Quick Summary */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                        <h2 className="text-xl font-bold text-green-900 mb-2">In Plain English</h2>
                        <ul className="space-y-2 text-green-800">
                            <li>✓ We don't collect any personal information</li>
                            <li>✓ Everything is stored locally on your device</li>
                            <li>✓ We don't track you or use analytics</li>
                            <li>✓ We don't use cookies or ads</li>
                            <li>✓ You control all your data</li>
                            <li>✓ This is a non-commercial educational project</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md p-8 space-y-8">

                {/* Information We Collect */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="text-pink-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                <AlertCircle size={20} className="text-blue-600" />
                                Automatically Collected Information
                            </h3>
                            <p className="text-gray-700">
                                <strong>None.</strong> This application does not collect, store, or transmit any personal information to external servers.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                <Lock size={20} className="text-green-600" />
                                User-Provided Information (Local Storage Only)
                            </h3>
                            <p className="text-gray-700 mb-2">
                                The following data is stored <strong>locally on your device only</strong>:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li>Reading history and progress</li>
                                <li>Favorite manga/manhwa lists</li>
                                <li>Reading preferences (theme, layout settings)</li>
                                <li>NSFW content preferences</li>
                                <li>Bookmarks and reading lists</li>
                            </ul>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h3 className="font-semibold text-lg mb-2 text-red-900">
                                Data We Do NOT Collect
                            </h3>
                            <ul className="list-disc list-inside text-red-800 space-y-1 ml-4">
                                <li>Personal identification information (name, email, phone number)</li>
                                <li>Location data</li>
                                <li>Device identifiers</li>
                                <li>Usage analytics</li>
                                <li>Crash reports</li>
                                <li>Advertising data</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* How We Use Information */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="text-purple-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">How We Use Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Local Storage</h3>
                            <p className="text-gray-700 mb-2">
                                All user data is stored exclusively in your browser's local storage:
                            </p>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li><strong>Purpose:</strong> To provide personalized reading experience</li>
                                <li><strong>Access:</strong> Only you have access to this data on your device</li>
                                <li><strong>Control:</strong> You can clear this data at any time through browser settings</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">No Server-Side Storage</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li>We do not maintain user accounts</li>
                                <li>We do not store any user data on our servers</li>
                                <li>We do not create user profiles</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Third-Party Services */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-orange-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">MangaDex API</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                            <li><strong>Purpose:</strong> To fetch manga/manhwa content and metadata</li>
                            <li><strong>Data Shared:</strong> Only content requests (manga IDs, chapter numbers)</li>
                            <li><strong>Privacy Policy:</strong> <a href="https://mangadex.org/privacy" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">MangaDex Privacy Policy</a></li>
                            <li><strong>Note:</strong> We proxy requests through our API to protect your IP address</li>
                        </ul>
                    </div>
                </section>

                {/* Data Storage and Security */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="text-green-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Data Storage & Security</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Security Measures</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li>HTTPS encryption for all API requests</li>
                                <li>No user authentication required</li>
                                <li>No cookies used for tracking</li>
                                <li>Content Security Policy (CSP) implemented</li>
                            </ul>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h3 className="font-semibold text-lg mb-2 text-yellow-900">No Cloud Sync</h3>
                            <ul className="list-disc list-inside text-yellow-800 space-y-1 ml-4">
                                <li>Your data is not synchronized across devices</li>
                                <li>Each device maintains its own local data</li>
                                <li>No backup or recovery service is provided</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Your Privacy Rights */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Data Access & Deletion</h3>
                            <p className="text-gray-700 mb-2">You can delete your data by:</p>
                            <ol className="list-decimal list-inside text-gray-700 space-y-1 ml-4">
                                <li>Clearing browser cache and local storage</li>
                                <li>Uninstalling the app (for mobile versions)</li>
                                <li>Using the "Clear Data" option in app settings (if available)</li>
                            </ol>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Data Portability</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li>Your data is stored in standard browser localStorage format</li>
                                <li>You can export it manually through browser developer tools</li>
                                <li>No automated export feature is currently provided</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Cookies and Tracking */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Eye className="text-red-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Cookies & Tracking</h2>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-500">
                        <h3 className="font-semibold text-lg mb-2 text-green-900 flex items-center gap-2">
                            <CheckCircle size={20} />
                            No Cookies or Tracking
                        </h3>
                        <ul className="list-disc list-inside text-green-800 space-y-1 ml-4">
                            <li>We do not use cookies for tracking</li>
                            <li>We do not use analytics services</li>
                            <li>We do not use advertising networks</li>
                            <li>Session data is cleared when you close the browser</li>
                        </ul>
                    </div>
                </section>

                {/* Age Restrictions */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-yellow-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Age Restrictions</h2>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                        <h3 className="font-semibold text-lg mb-2 text-yellow-900">Adult Content</h3>
                        <ul className="list-disc list-inside text-yellow-800 space-y-1 ml-4">
                            <li>The app includes age-restricted (18+) content sections</li>
                            <li>Age verification is based on user self-declaration</li>
                            <li>We do not collect or verify age information</li>
                            <li>Parents/guardians are responsible for monitoring minor's usage</li>
                            <li>Access to NSFW content can be disabled in settings</li>
                        </ul>
                    </div>
                </section>

                {/* Educational Purpose */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-indigo-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Educational Purpose</h2>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Non-Commercial Use</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                            <li>This app is for educational and demonstration purposes only</li>
                            <li>No monetization or commercial data collection</li>
                            <li>No user profiling or behavioral tracking</li>
                            <li>No data selling or sharing with third parties</li>
                        </ul>
                    </div>
                </section>

                {/* Contact Information */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-gray-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 mb-2">
                            If you have questions about this Privacy Policy or our data practices:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                            <li><strong>Email:</strong> mineoreyt@gmail.com</li>
                            <li><strong>GitHub:</strong> <a href="https://github.com/MineoreYT/InkStream" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">InkStream Repository</a></li>
                        </ul>
                    </div>
                </section>

                {/* Legal Compliance */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-purple-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Legal Compliance</h2>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Applicable Laws</h3>
                        <p className="text-gray-700 mb-2">This Privacy Policy complies with:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                            <li>General Data Protection Regulation (GDPR) principles</li>
                            <li>California Consumer Privacy Act (CCPA) principles</li>
                            <li>Other applicable privacy laws</li>
                        </ul>
                    </div>
                </section>

                {/* Changes to Policy */}
                <section className="border-t pt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Policy</h2>
                    <p className="text-gray-700">
                        We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date.
                        Continued use of the app constitutes acceptance of changes. Users are encouraged to review this policy regularly.
                    </p>
                </section>

            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>Version 1.0 | Last Updated: January 3, 2026</p>
                <p className="mt-2">
                    This is an educational project. All manga content belongs to respective copyright holders.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
