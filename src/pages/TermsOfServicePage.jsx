import { FileText, Shield, AlertTriangle, Users, CheckCircle, XCircle } from 'lucide-react';

const TermsOfServicePage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-8 mb-8 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <FileText size={40} />
                    <h1 className="text-4xl font-bold">Terms of Service</h1>
                </div>
                <p className="text-lg opacity-90">
                    Please read these terms carefully before using InkStream.
                </p>
                <p className="text-sm mt-2 opacity-75">
                    Effective Date: December 2024
                </p>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md p-8 space-y-8">

                {/* Educational Use Only */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-yellow-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Educational Use Only</h2>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-4">
                        <h3 className="font-semibold text-lg mb-2 text-yellow-900">Acceptance of Terms</h3>
                        <p className="text-yellow-800">
                            By accessing or using InkStream, you agree to be bound by these Terms of Service.
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Educational Purpose</h3>
                        <p className="text-gray-700 mb-2">This application is designed and intended solely for:</p>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                            <li>Educational demonstration of web technologies</li>
                            <li>Portfolio showcase of development skills</li>
                            <li>Learning purposes for students and developers</li>
                            <li>Technical research and development</li>
                        </ul>
                    </div>
                </section>

                {/* Prohibited Uses */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <XCircle className="text-red-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Prohibited Uses</h2>
                    </div>

                    <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3 text-red-900">You may NOT use this application for:</h3>
                        <ul className="list-disc list-inside text-red-800 space-y-2 ml-4">
                            <li>Commercial purposes or profit generation</li>
                            <li>Mass distribution of copyrighted content</li>
                            <li>Circumventing official manga/manhwa platforms</li>
                            <li>Any activity that violates copyright laws</li>
                            <li>Reselling, redistributing, or monetizing content</li>
                        </ul>
                    </div>
                </section>

                {/* Content Disclaimer */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-purple-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Content Disclaimer</h2>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>All manga/manhwa content belongs to respective copyright holders</li>
                            <li>We do not own, host, or distribute copyrighted material</li>
                            <li>Content is accessed through public APIs only</li>
                            <li>Users must respect intellectual property rights</li>
                        </ul>
                    </div>
                </section>

                {/* Age Restrictions */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-orange-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Age Restrictions</h2>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-300">
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Adult content sections require age verification (18+)</li>
                            <li>Users must comply with local age restriction laws</li>
                            <li>Parents/guardians are responsible for minor's usage</li>
                        </ul>
                    </div>
                </section>

                {/* User Conduct */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="text-green-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">User Conduct</h2>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Users agree to:</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Use the application responsibly and legally</li>
                            <li>Respect copyright and intellectual property rights</li>
                            <li>Not attempt to circumvent security measures</li>
                            <li>Report any inappropriate content or behavior</li>
                        </ul>
                    </div>
                </section>

                {/* Modifications */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Modifications</h2>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">We reserve the right to:</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                            <li>Modify or discontinue the service at any time</li>
                            <li>Update these terms without prior notice</li>
                            <li>Remove content upon copyright holder request</li>
                            <li>Block access for terms violations</li>
                        </ul>
                    </div>
                </section>

                {/* Governing Law */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="text-indigo-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-900">Governing Law</h2>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                            These terms are governed by applicable copyright and intellectual property laws.
                        </p>
                    </div>
                </section>

                {/* Contact */}
                <section className="border-t pt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
                    <p className="text-gray-700">
                        For questions about these terms: <a href="mailto:mineoreyt@gmail.com" className="text-blue-600 hover:underline">mineoreyt@gmail.com</a>
                    </p>
                </section>

            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center text-sm text-gray-500">
                <p>Effective Date: December 2024</p>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
