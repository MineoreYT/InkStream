import { Shield, FileText, AlertTriangle, ExternalLink, Mail } from 'lucide-react';

const LegalPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg p-8 mb-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <Shield size={40} />
                    <h1 className="text-4xl font-bold">Legal Information</h1>
                </div>
                <p className="text-lg opacity-90">
                    Important legal notices and copyright information.
                </p>
                <p className="text-sm mt-2 opacity-75">
                    Last Updated: December 2024
                </p>
            </div>

            {/* Important Notice */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                        <h2 className="text-xl font-bold text-red-900 mb-2">IMPORTANT LEGAL NOTICE</h2>
                        <p className="text-red-800">
                            This application is provided for <strong>educational and demonstration purposes only</strong>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md p-8 space-y-8">

                {/* Copyright Disclaimer */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Copyright Disclaimer</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Content Ownership</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>All manga and manhwa content displayed in this application belongs to their respective copyright holders</li>
                                <li>This includes but is not limited to: images, text, characters, storylines, and artwork</li>
                                <li>We do not claim ownership of any manga/manhwa content</li>
                                <li>All rights belong to the original creators, publishers, and distributors</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Educational Purpose */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-green-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Educational Purpose</h2>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">This application was created to demonstrate:</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Modern web development techniques</li>
                            <li>React.js and related technologies</li>
                            <li>API integration and data handling</li>
                            <li>Progressive Web App (PWA) development</li>
                            <li>Mobile app development with Capacitor</li>
                        </ul>
                    </div>
                </section>

                {/* Data Source */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <ExternalLink className="text-purple-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Data Source</h2>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Content is sourced from the public MangaDex API</li>
                            <li>We do not host, store, or distribute copyrighted content directly</li>
                            <li>All content requests are proxied through MangaDex's official API</li>
                            <li>We respect MangaDex's terms of service and usage policies</li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-purple-200">
                            <a
                                href="https://mangadex.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium"
                            >
                                <ExternalLink size={16} />
                                Visit MangaDex
                            </a>
                        </div>
                    </div>
                </section>

                {/* User Responsibility */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-yellow-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">User Responsibility</h2>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                        <h3 className="font-semibold text-lg mb-2 text-yellow-900">By using this application, users acknowledge that:</h3>
                        <ul className="list-disc list-inside text-yellow-800 space-y-2 ml-4">
                            <li>They are responsible for complying with local copyright laws</li>
                            <li>They understand this is for educational/demonstration purposes</li>
                            <li>They will not use this application for commercial purposes</li>
                            <li>They respect the rights of content creators and publishers</li>
                        </ul>
                    </div>
                </section>

                {/* No Commercial Use */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-indigo-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">No Commercial Use</h2>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>This application is not monetized in any way</li>
                            <li>No advertisements, subscriptions, or paid features</li>
                            <li>No revenue is generated from copyrighted content</li>
                            <li>This is a non-commercial, educational project</li>
                        </ul>
                    </div>
                </section>

                {/* DMCA Compliance */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Mail className="text-red-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">DMCA Compliance</h2>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                        <p className="text-gray-700 mb-3">
                            If you are a copyright holder and believe your content is being used inappropriately:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Contact us immediately for content removal</li>
                            <li>We will respond promptly to legitimate takedown requests</li>
                            <li>Email: <a href="mailto:mineoreyt@gmail.com" className="text-red-700 hover:underline font-medium">mineoreyt@gmail.com</a></li>
                        </ul>
                    </div>
                </section>

                {/* Limitation of Liability */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-orange-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>This application is provided "as is" without warranties</li>
                            <li>Users assume all risks associated with usage</li>
                            <li>We are not liable for any copyright infringement by users</li>
                            <li>We do not endorse or encourage copyright violation</li>
                        </ul>
                    </div>
                </section>

            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>Last Updated: December 2024</p>
                <p className="mt-2">
                    For questions or concerns: <a href="mailto:mineoreyt@gmail.com" className="text-pink-600 hover:underline">mineoreyt@gmail.com</a>
                </p>
            </div>
        </div>
    );
};

export default LegalPage;
