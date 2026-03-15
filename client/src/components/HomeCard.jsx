import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getPhotoGradient } from '../utils/helpers';
import * as api from '../services/api';

const API_BASE = '';

export default function HomeCard({ home, isSample = false, isFavorited = false, onFavToggle }) {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const name = home.name || home.homeName;
    const location = home.location || home.homeLocation;
    const price = home.price || home.homePrice;
    const rating = home.rating || home.homeRating;
    const photo = home.photo || home.homePhoto;
    const imageUrl = home.imageUrl;

    const handleFavToggle = async (e) => {
        e.stopPropagation();
        if (!currentUser) {
            showToast('Please log in to save favorites', 'error');
            navigate('/login');
            return;
        }
        try {
            if (isFavorited) {
                await api.removeFavorite(home._id);
                showToast('Removed from favorites', 'info');
            } else {
                await api.addFavorite(home._id);
                showToast('Added to favorites!', 'success');
            }
            if (onFavToggle) onFavToggle();
        } catch (err) {
            showToast('Failed to update favorites', 'error');
        }
    };

    const bgStyle = imageUrl
        ? { backgroundImage: `url(${API_BASE}${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: getPhotoGradient(photo) };

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden shadow-sm card-hover cursor-pointer group"
            onClick={() => !isSample && navigate(`/home/${home._id}`)}
        >
            <div className="relative h-56 overflow-hidden" style={bgStyle}>
                {!imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                )}
                {!isSample && (
                    <button onClick={handleFavToggle} className="absolute top-4 right-4 p-2.5 bg-white/90 rounded-full hover:bg-white transition-all shadow-sm">
                        <svg className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">{name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                        <svg className="w-4 h-4 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="font-medium text-gray-900">{rating}</span>
                    </div>
                </div>
                <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                </p>
                <p className="font-semibold text-gray-900">${price} <span className="font-normal text-gray-500">/ night</span></p>
            </div>
        </div>
    );
}
