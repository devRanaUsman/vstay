import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HomeCard from '../components/HomeCard';
import { sampleHomes } from '../utils/helpers';
import * as api from '../services/api';

export default function ExplorePage() {
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

    const displayHomes = Array.isArray(homes) && homes.length > 0 ? homes : sampleHomes;
    const isSample = !Array.isArray(homes) || homes.length === 0;

    return (
        <div className="fade-in py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Explore All Stays</h1>
                    <p className="text-gray-600">Find your perfect home away from home</p>
                </div>

                {isSample && (
                    <p className="text-sm text-gray-500 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 inline-block">
                        ✨ Sample properties shown. Be the first to list your home!
                    </p>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
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
                ) : displayHomes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
                        <p className="text-gray-500 mb-6">Be the first to list your property!</p>
                        <button onClick={() => navigate('/signup')} className="px-6 py-3 btn-primary text-white font-semibold rounded-full">
                            Become a Host
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {displayHomes.map(home => (
                            <HomeCard
                                key={home._id}
                                home={home}
                                isSample={isSample}
                                isFavorited={Array.isArray(favIds) && favIds.includes(home._id)}
                                onFavToggle={fetchData}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
