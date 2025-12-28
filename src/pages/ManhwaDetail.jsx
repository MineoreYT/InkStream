import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Shield, Play, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { API_SOURCES } from '../services/apiManager';
import manhwa18Api from '../services/manhwa18ApiReal';

const ManhwaDetail = () => {
  const { source, id } = useParams();
  const [manhwa, setManhwa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchManhwaDetails();
  }, [source, id]);

  const fetchManhwaDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Directly use manhwa18Api to bypass age verification
      const data = await manhwa18Api.getManhwaDetails(id);
      setManhwa(data);
    } catch (err) {
      setError(err.message || 'Failed to load manhwa details');
      console.error('Error fetching manhwa details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Manhwa</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={fetchManhwaDetails}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                Try Again
              </button>
              <Link
                to="/manhwa"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
              >
                Back to Manhwa
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!manhwa) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manhwa Not Found</h1>
            <p className="text-gray-600 mb-6">The requested manhwa could not be found.</p>
            <Link
              to="/manhwa"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Back to Manhwa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/manhwa"
          className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Manhwa
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Cover Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <img
                src={manhwa.coverArt}
                alt={manhwa.title}
                className="w-full h-96 md:h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://dummyimage.com/400x600/e5e7eb/9ca3af&text=No+Cover';
                }}
              />
            </div>

            {/* Manhwa Info */}
            <div className="md:w-2/3 lg:w-3/4 p-6 lg:p-8">
              {/* Title and Rating */}
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {manhwa.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    🔞 {manhwa.rating}
                  </span>
                </div>
              </div>

              {/* Adult Content Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Shield className="text-red-500 mr-2" size={20} />
                  <span className="text-red-800 font-medium">Adult Content Warning</span>
                </div>
                <p className="text-red-700 text-sm mt-1">
                  This manhwa contains mature themes and is intended for readers 18 years and older.
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <User className="mr-2" size={16} />
                  <span className="text-sm">
                    <strong>Author:</strong> {manhwa.author}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="mr-2" size={16} />
                  <span className="text-sm">
                    <strong>Artist:</strong> {manhwa.artist}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2" size={16} />
                  <span className="text-sm">
                    <strong>Status:</strong> {manhwa.status}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="mr-2" size={16} />
                  <span className="text-sm">
                    <strong>Source:</strong> Manhwa18
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Tag className="mr-2 text-gray-600" size={16} />
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {manhwa.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tag === 'Adult' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Synopsis</h2>
                <p className="text-gray-700 leading-relaxed">
                  {manhwa.description}
                </p>
              </div>

              {/* Quick Read Button */}
              {manhwa.chapters && manhwa.chapters.length > 0 && (
                <div className="mb-8">
                  <Link
                    to={`/read/${source || API_SOURCES.MANHWA18}/${id}/${manhwa.chapters[0].id}`}
                    className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Play className="mr-2" size={20} />
                    Start Reading - Chapter 1
                  </Link>
                  <p className="text-sm text-gray-500 mt-2">
                    🔞 Adult content - Age verification required
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chapters Section */}
          <div className="border-t border-gray-200 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chapters</h2>
              <span className="text-sm text-gray-500">
                {manhwa.chapters?.length || 0} chapters available
              </span>
            </div>

            {manhwa.chapters && manhwa.chapters.length > 0 ? (
              <div className="grid gap-3">
                {manhwa.chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    to={`/read/${source || API_SOURCES.MANHWA18}/${id}/${chapter.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center">
                      <Play className="mr-3 text-red-600 group-hover:text-red-700" size={16} />
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-red-700">
                          {chapter.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="mr-1" size={12} />
                          {new Date(chapter.publishedAt).toLocaleDateString()}
                          {chapter.isAdult && (
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                              18+
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-red-600 group-hover:text-red-700">
                      →
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📚</div>
                <p className="text-gray-500">No chapters available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManhwaDetail;