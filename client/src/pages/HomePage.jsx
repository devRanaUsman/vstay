import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HomeCard from '../components/HomeCard';
import { sampleHomes } from '../utils/helpers';
import * as api from '../services/api';

export default function HomePage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [homes, setHomes] = useState([]);
    const [favIds, setFavIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.getHomes();
            setHomes(res.data);
            if (currentUser) {
                const favRes = await api.getFavoriteIds();
                setFavIds(favRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [currentUser]);

    const displayHomes = Array.isArray(homes) && homes.length > 0 ? homes.slice(0, 6) : sampleHomes;
    const isSample = !Array.isArray(homes) || homes.length === 0;

    return (
        <div className="slide-up">
            {/* Hero Section */}
            <section className="relative hero-gradient py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Find your perfect stay
                    </h1>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Discover unique homes and experiences around the world
                    </p>
                    <button onClick={() => navigate('/explore')} className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all hover:shadow-xl text-lg">
                        Explore Stays
                    </button>
                </div>
            </section>

            {/* Featured Homes */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Featured Stays</h2>
                            <p className="text-gray-600">Handpicked properties for your next adventure</p>
                        </div>
                        <button onClick={() => navigate('/explore')} className="hidden sm:flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                            View all
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>

                    {isSample && (
                        <p className="text-sm text-gray-500 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 inline-block">
                            ✨ Sample properties shown. Be the first to list your home!
                        </p>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                    <div className="h-56 skeleton"></div>
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 skeleton rounded w-3/4"></div>
                                        <div className="h-4 skeleton rounded w-1/2"></div>
                                        <div className="h-5 skeleton rounded w-1/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {displayHomes.map(home => (
                                <HomeCard
                                    key={home._id}
                                    home={home}
                                    isSample={isSample}
                                    isFavorited={favIds.includes(home._id)}
                                    onFavToggle={fetchData}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">Become a Host</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">Share your space and earn extra income by hosting travelers from around the world</p>
                    <button
                        onClick={() => currentUser?.userType === 'host' ? navigate('/add-home') : navigate('/signup')}
                        className="px-8 py-4 hero-gradient text-white font-semibold rounded-full hover:opacity-90 transition-all"
                    >
                        Start Hosting
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <span className="font-bold text-gray-900">V-Stay</span>
                        </div>
                        <p className="text-gray-500 text-sm">© 2024 V-Stay. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
