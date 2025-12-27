import { Heart, BookOpen } from 'lucide-react';

const FavoritesPage = () => {
  return (
    <div className="space-y-6">
      {/* Favorites Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Favorites
          </h1>
        </div>
        <p className="text-gray-600">
          Your favorite manga collection
        </p>
      </div>

      {/* Coming Soon Content */}
      <div className="text-center py-16">
        <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Coming Soon!</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          The favorites feature is currently under development. Soon you'll be able to save and organize your favorite manga here.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> For now, you can bookmark manga pages in your browser to keep track of your favorites!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;