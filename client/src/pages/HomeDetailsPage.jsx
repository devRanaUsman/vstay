import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getPhotoGradient, downloadHouseRules } from '../utils/helpers';
import BookingModal from '../components/BookingModal';
import * as api from '../services/api';

export default function HomeDetailsPage() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [home, setHome] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFav, setIsFav] = useState(false);
    const [showBooking, setShowBooking] = useState(false);

    const fetchHome = async () => {
        try {
            if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
                setHome(res.data);
            }
            if (currentUser) {
                const favRes = await api.getFavoriteIds();
                setIsFav(Array.isArray(favRes.data) && favRes.data.includes(id));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHome(); }, [id, currentUser]);

    const toggleFavorite = async () => {
        if (!currentUser) {
            showToast('Please log in to save favorites', 'error');
            navigate('/login');
            return;
        }
        try {
            if (isFav) {
                await api.removeFavorite(home._id);
                showToast('Removed from favorites', 'info');
                setIsFav(false);
            } else {
                await api.addFavorite(home._id);
                showToast('Added to favorites!', 'success');
                setIsFav(true);
            }
        } catch (err) {
            showToast('Failed to update favorites', 'error');
        }
    };

    const openBooking = () => {
        if (!currentUser) {
            showToast('Please log in to book a stay', 'error');
            navigate('/login');
            return;
        }
        setShowBooking(true);
    };

    if (loading) {
        return (
            <div className="fade-in">
                <div className="h-[50vh] min-h-[400px] skeleton"></div>
                <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10 pb-16">
                    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 space-y-6">
                        <div className="h-8 skeleton rounded w-1/2"></div>
                        <div className="h-5 skeleton rounded w-1/3"></div>
                        <div className="h-40 skeleton rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!home) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
                    <button onClick={() => navigate('/explore')} className="px-6 py-3 btn-primary text-white font-semibold rounded-full">
                        Back to Explore
                    </button>
                </div>
            </div>
        );
    }

    const bgStyle = home.imageUrl
        ? { backgroundImage: `url(${home.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: getPhotoGradient(home.photo) };

    return (
        <div className="fade-in">
            <div className="relative h-[50vh] min-h-[400px]" style={bgStyle}>
                {!home.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-32 h-32 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                )}
                <button onClick={() => navigate('/explore')} className="absolute top-6 left-6 p-3 bg-white/90 rounded-full hover:bg-white transition-all shadow-lg">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button onClick={toggleFavorite} className="absolute top-6 right-6 p-3 bg-white/90 rounded-full hover:bg-white transition-all shadow-lg">
                    <svg className={`w-5 h-5 ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-16">
                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
                        <div>
                            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{home.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600">
                                <span className="flex items-center gap-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {home.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-5 h-5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    {home.rating} rating
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-gray-900">${home.price}</p>
                            <p className="text-gray-500">per night</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 mb-8">
                        <h2 className="font-semibold text-xl text-gray-900 mb-4">About this property</h2>
                        <p className="text-gray-600 leading-relaxed">{home.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={openBooking} className="flex-1 py-4 btn-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all text-lg">
                            Book Now
                        </button>
                        <button onClick={() => { downloadHouseRules(home.name); showToast('House rules downloaded!', 'success'); }} className="px-6 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            House Rules
                        </button>
                    </div>
                </div>
            </div>

            {showBooking && (
                <BookingModal
                    homeId={home._id}
                    onClose={() => setShowBooking(false)}
                    onBooked={() => navigate('/bookings')}
                />
            )}
        </div>
    );
}
