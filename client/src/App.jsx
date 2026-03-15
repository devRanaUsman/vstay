import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomeDetailsPage from './pages/HomeDetailsPage';
import DashboardPage from './pages/DashboardPage';
import AddHomePage from './pages/AddHomePage';
import EditHomePage from './pages/EditHomePage';
import FavoritesPage from './pages/FavoritesPage';
import BookingsPage from './pages/BookingsPage';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl hero-gradient flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Loading V-Stay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <Navbar />
      <main className="pt-16 min-h-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home/:id" element={<HomeDetailsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-home" element={<AddHomePage />} />
          <Route path="/edit-home/:id" element={<EditHomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
