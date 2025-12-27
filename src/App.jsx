import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import { NSFWProvider } from './contexts/NSFWContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MangaDetail from './pages/MangaDetail';
import MangaReader from './pages/MangaReader';
import CategoryPage from './pages/CategoryPage';
import SearchResults from './pages/SearchResults';
import PopularPage from './pages/PopularPage';
import LatestPage from './pages/LatestPage';
import NSFWPage from './pages/NSFWPage';
import FavoritesPage from './pages/FavoritesPage';
import ReadingListPage from './pages/ReadingListPage';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <NSFWProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Full-screen manga reader route */}
            <Route path="/read/:mangaId/:chapterId" element={<MangaReader />} />
            
            {/* Regular app layout routes */}
            <Route path="/*" element={
              <div className="min-h-screen bg-gray-50">
                <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                
                {/* Overlay for mobile */}
                {sidebarOpen && (
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={handleOverlayClick}
                  />
                )}
                
                <main className={`transition-all duration-300 pt-16 sm:pt-20 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
                  <div className="p-4 sm:p-6">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/manga/:id" element={<MangaDetail />} />
                      <Route path="/category/:tag" element={<CategoryPage />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/popular" element={<PopularPage />} />
                      <Route path="/latest" element={<LatestPage />} />
                      <Route path="/nsfw" element={<NSFWPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/reading-list" element={<ReadingListPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </main>
              </div>
            } />
          </Routes>
        </Router>
      </NotificationProvider>
    </NSFWProvider>
  );
}

export default App;