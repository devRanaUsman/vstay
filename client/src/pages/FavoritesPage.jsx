import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HomeCard from '../components/HomeCard';
import * as api from '../services/api';

export default function FavoritesPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [favIds, setFavIds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchFavorites();
    }, [currentUser]);

    const fetchFavorites = async () => {
        try {
            const res = await api.getFavorites();
            setFavorites(res.data);
            const idsRes = await api.getFavoriteIds();
            setFavIds(idsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fade-in py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 skeleton rounded w-1/3 mb-10"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                <div className="h-56 skeleton"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-5 skeleton rounded w-3/4"></div>
                                    <div className="h-4 skeleton rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
                    <p className="text-gray-600">Properties you've saved for later</p>
                </div>

                {!Array.isArray(favorites) || favorites.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
                        <p className="text-gray-500 mb-6">Start exploring and save properties you love!</p>
                        <button onClick={() => navigate('/explore')} className="px-6 py-3 btn-primary text-white font-semibold rounded-full">
                            Explore Properties
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {favorites.map(home => (
                            <HomeCard
                                key={home._id}
                                home={home}
                                isFavorited={Array.isArray(favIds) && favIds.includes(home._id)}
                                onFavToggle={fetchFavorites}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
