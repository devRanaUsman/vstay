import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getPhotoGradient } from '../utils/helpers';
import * as api from '../services/api';

export default function BookingsPage() {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [currentUser]);

    const fetchBookings = async () => {
        try {
            const res = await api.getBookings();
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        try {
            await api.cancelBooking(bookingId);
            showToast('Booking cancelled', 'info');
            fetchBookings();
        } catch (err) {
            showToast('Failed to cancel booking', 'error');
        }
    };

    if (loading) {
        return (
            <div className="fade-in py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="h-10 skeleton rounded w-1/3 mb-10"></div>
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-40 skeleton rounded-2xl"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-600">Your upcoming and past stays</p>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-500 mb-6">Book your first stay and it will appear here!</p>
                        <button onClick={() => navigate('/explore')} className="px-6 py-3 btn-primary text-white font-semibold rounded-full">
                            Find a Stay
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map(booking => {
                            const home = booking.homeId;
                            if (!home) return null;

                            const checkIn = new Date(booking.checkIn);
                            const checkOut = new Date(booking.checkOut);
                            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                            const total = nights * home.price;
                            const isPast = checkOut < new Date();

                            const bgStyle = home.imageUrl
                                ? { backgroundImage: `url(${home.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                : { background: getPhotoGradient(home.photo) };

                            return (
                                <div key={booking._id} className={`bg-white rounded-2xl shadow-sm overflow-hidden ${isPast ? 'opacity-75' : ''}`}>
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="w-full sm:w-48 h-32 sm:h-auto flex-shrink-0" style={bgStyle}></div>
                                        <div className="flex-1 p-6">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-xl text-gray-900 mb-1">{home.name}</h3>
                                                    <p className="text-gray-500 flex items-center gap-1 mb-3">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        </svg>
                                                        {home.location}
                                                    </p>
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <span className="flex items-center gap-1 text-gray-600">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {checkIn.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {checkOut.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-gray-600">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-gray-900">${total}</p>
                                                    <p className="text-sm text-gray-500">{nights} night{nights > 1 ? 's' : ''}</p>
                                                    {isPast ? (
                                                        <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Completed</span>
                                                    ) : (
                                                        <button onClick={() => handleCancel(booking._id)} className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium">
                                                            Cancel Booking
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
