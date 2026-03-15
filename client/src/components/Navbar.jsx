import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">V-Stay</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Home</Link>
                        <Link to="/explore" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Explore</Link>
                        {currentUser?.userType === 'host' && (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Dashboard</Link>
                                <Link to="/add-home" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Add Home</Link>
                            </>
                        )}
                        {currentUser && (
                            <>
                                <Link to="/favorites" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Favorites</Link>
                                <Link to="/bookings" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Bookings</Link>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {!currentUser ? (
                            <div className="flex items-center gap-3">
                                <button onClick={() => navigate('/login')} className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors">Log in</button>
                                <button onClick={() => navigate('/signup')} className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all">Sign up</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600 font-medium hidden sm:block">Hi, {currentUser.firstName}</span>
                                <button onClick={handleLogout} className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition-colors">Log out</button>
                            </div>
                        )}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden border-t border-gray-200/50 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100">Home</Link>
                        <Link to="/explore" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100">Explore</Link>
                        {currentUser?.userType === 'host' && (
                            <>
                                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100">Dashboard</Link>
                                <Link to="/add-home" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100">Add Home</Link>
                            </>
                        )}
                        {currentUser && (
                            <>
                                <Link to="/favorites" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100">Favorites</Link>
                                <Link to="/bookings" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100">Bookings</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
