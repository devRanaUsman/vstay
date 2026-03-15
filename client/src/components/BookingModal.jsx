import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import * as api from '../services/api';

export default function BookingModal({ homeId, onClose, onBooked }) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const checkIn = formData.get('checkIn');
        const checkOut = formData.get('checkOut');
        const guests = formData.get('guests');

        if (new Date(checkOut) <= new Date(checkIn)) {
            showToast('Check-out must be after check-in', 'error');
            return;
        }

        setLoading(true);
        try {
            await api.createBooking({ homeId, checkIn, checkOut, guests: parseInt(guests) });
            showToast('Booking confirmed!', 'success');
            onClose();
            if (onBooked) onBooked();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to book. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Book Your Stay</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                            <input type="date" name="checkIn" required min={today} className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                            <input type="date" name="checkOut" required min={today} className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                            <input type="number" name="guests" min="1" max="10" defaultValue="1" required className="w-full px-4 py-3 border border-gray-300 rounded-xl input-focus focus:border-purple-500 focus:outline-none" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full mt-6 py-3 btn-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                        {loading ? '⟳ Booking...' : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
