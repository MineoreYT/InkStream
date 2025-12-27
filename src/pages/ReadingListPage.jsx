import { BookOpen, Clock } from 'lucide-react';

const ReadingListPage = () => {
  return (
    <div className="space-y-6">
      {/* Reading List Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Reading List
          </h1>
        </div>
        <p className="text-gray-600">
          Track your reading progress and continue where you left off
        </p>
      </div>

      {/* Coming Soon Content */}
      <div className="text-center py-16">
        <BookOpen className="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Coming Soon!</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          The reading list feature is currently under development. Soon you'll be able to track your reading progress and continue where you left off.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-green-700">
            📚 <strong>Coming Features:</strong> Reading progress tracking, continue reading suggestions, and reading history!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadingListPage;